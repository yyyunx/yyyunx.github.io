import { readFile, readdir, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const root = process.cwd();
const mode = process.argv[2] || 'source';
const ignored = new Set([
  '.git',
  '.astro',
  '.local',
  '.pnpm-store',
  'node_modules',
  'dist',
  'test-results',
  'playwright-report',
  'private',
  'drafts',
]);
const errors = [];
const textExtensions =
  /\.(astro|[cm]?[jt]sx?|json|ya?ml|mdx?|css|html|svg|txt|xml)$/i;
const secrets = [
  ['GitHub credential', /\bgh[pousr]_[A-Za-z0-9_]{24,}\b/],
  ['GitHub app credential', /\bgithub_pat_[A-Za-z0-9_]{30,}\b/],
  ['Private key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
  ['Cloud access key', /\bAKIA[A-Z0-9]{16}\b/],
  [
    'Credential assignment',
    /(?:api[_-]?key|access[_-]?token|client[_-]?secret|password)\s*[:=]\s*["'][A-Za-z0-9+/_=-]{24,}["']/i,
  ],
  [
    'Internal address',
    /https?:\/\/(?:localhost|127\.0\.0\.1|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(?:1[6-9]|2\d|3[01])\.\d+\.\d+|[a-z0-9.-]+\.internal)(?::\d+)?(?:\/|\b)/i,
  ],
];
// Private identifiers stay exclusively in an ignored local file, never in CI.
let privatePatterns = [];
try {
  privatePatterns = JSON.parse(
    await readFile('.local/private-patterns.json', 'utf8'),
  );
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const sources = JSON.parse(await readFile('docs/public-sources.json', 'utf8'));
const approved = new Set(
  sources.projects.map((p) => 'https://github.com/yyyunx/' + p.repo),
);
const contentKeys = new Set();

async function walk(directory, skipIgnored = true) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (skipIgnored && ignored.has(entry.name)) continue;
    const full = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(
        'Symbolic link requires review: ' + path.relative(root, full),
      );
      continue;
    }
    if (entry.isDirectory()) files.push(...(await walk(full, skipIgnored)));
    else files.push(full);
  }
  return files;
}

if (mode === 'source') {
  const staged = execFileSync(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    { encoding: 'utf8' },
  )
    .trim()
    .split('\n')
    .filter(Boolean);
  for (const name of staged) {
    if (/(^|\/)(?:\.local|private|drafts|\.env[^/]*)(\/|$)/.test(name))
      errors.push('Private/local file staged: ' + name);
  }
  for (const collection of ['projects', 'notes']) {
    for (const file of await walk(path.join(root, 'src/content', collection))) {
      const text = await readFile(file, 'utf8');
      if (!/\.mdx?$/.test(file)) continue;
      const frontmatter = text.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] || '';
      const scalar = (key) =>
        frontmatter.match(
          new RegExp('^' + key + ':\\s*["\']?([^"\'\\r\\n]+?)["\']?\\s*$', 'm'),
        )?.[1];
      const visibility = scalar('visibility');
      if (!['public', 'draft'].includes(visibility))
        errors.push('Explicit public/draft policy missing: ' + file);
      const key = [collection, scalar('lang'), scalar('translationKey')].join(
        ':',
      );
      if (contentKeys.has(key)) errors.push('Duplicate route: ' + key);
      contentKeys.add(key);
      if (collection === 'projects' && !approved.has(scalar('repository')))
        errors.push('Repository is outside reviewed public allowlist: ' + file);
    }
  }
}

const files =
  mode === 'dist'
    ? await walk(path.join(root, 'dist'), false)
    : await walk(root);
for (const file of files) {
  const relative = path.relative(root, file);
  if (/\.(pt|pth|onnx|pkl|sqlite|db|pem|key)$/i.test(file))
    errors.push('Restricted asset: ' + relative);
  if (!textExtensions.test(file)) continue;
  const text = await readFile(file, 'utf8');
  for (const term of privatePatterns)
    if (text.toLowerCase().includes(term.toLowerCase()))
      errors.push('Private identifier in ' + relative);
  for (const [label, pattern] of secrets) {
    // Local development URLs are valid in maintenance docs and test tooling.
    if (
      label === 'Internal address' &&
      mode === 'source' &&
      !/^(src|public)[\\/]/.test(relative)
    )
      continue;
    if (pattern.test(text)) errors.push(label + ' in ' + relative);
  }
}
if (mode === 'dist') {
  const sitemap = await readFile('dist/sitemap.xml', 'utf8');
  if (/draft|private|404|localhost/i.test(sitemap))
    errors.push('Unexpected sitemap entry');
  if (!(await stat('dist/index.html')).isFile())
    errors.push('Missing homepage');
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    'Public-content review passed (' + mode + '; ' + files.length + ' files).',
  );
