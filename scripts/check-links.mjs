import { readFile, readdir, writeFile, mkdir, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const origin = 'https://yyyunx.github.io';
const external = process.argv.includes('--external');
const errors = [];
const seenExternal = new Map();
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const result = [];
  for (const entry of entries) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await walk(file)));
    else if (file.endsWith('.html')) result.push(file);
  }
  return result;
}
const pages = await walk(root);
const documents = new Map(
  await Promise.all(
    pages.map(async (file) => [file, await readFile(file, 'utf8')]),
  ),
);
const decode = (text) =>
  text
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
let checked = 0;
for (const [file, html] of documents) {
  const pathname =
    '/' +
    path
      .relative(root, file)
      .replaceAll(path.sep, '/')
      .replace(/index\.html$/, '');
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1)
    errors.push(pathname + ': expected one H1');
  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)) {
    const value = decode(match[1]);
    if (/^(mailto:|tel:|data:)/.test(value)) continue;
    if (value === '#' || !value) {
      errors.push(pathname + ': placeholder link');
      continue;
    }
    const url = new URL(value, origin + pathname);
    if (
      url.origin !== origin ||
      /\/web-programming-homeworks(?:\/|$)/.test(url.pathname)
    ) {
      if (url.protocol.startsWith('http')) seenExternal.set(url.href, null);
      continue;
    }
    let target = path.join(root, decodeURIComponent(url.pathname));
    if (url.pathname.endsWith('/')) target = path.join(target, 'index.html');
    try {
      await access(target);
    } catch {
      errors.push(pathname + ': missing ' + url.pathname);
      continue;
    }
    if (url.hash && documents.has(target)) {
      const id = decodeURIComponent(url.hash.slice(1));
      if (
        ![...documents.get(target).matchAll(/\bid=["']([^"']+)["']/g)].some(
          (match) => match[1] === id,
        )
      )
        errors.push(pathname + ': missing anchor ' + url.href);
    }
    checked++;
  }
}
const results = [];
if (external) {
  const urls = [...seenExternal.keys()];
  let next = 0;
  await Promise.all(
    Array.from({ length: 5 }, async () => {
      while (next < urls.length) {
        const url = urls[next++];
        let result;
        for (let attempt = 0; attempt < 2; attempt++) {
          try {
            const response = await fetch(url, {
              method: 'GET',
              redirect: 'follow',
              signal: AbortSignal.timeout(25000),
              headers: { 'User-Agent': 'Portfolio-Link-Verification' },
            });
            await response.body?.cancel();
            result = { url, status: response.status, finalUrl: response.url };
            if (response.status !== 429 && response.status < 500) break;
          } catch (error) {
            result = { url, error: error.message };
          }
        }
        results.push(result);
        if (result.error || result.status >= 400)
          errors.push(
            'External link: ' +
              url +
              ' (' +
              (result.status || result.error) +
              ')',
          );
      }
    }),
  );
}
await mkdir('test-results', { recursive: true });
await writeFile(
  'test-results/' + (external ? 'external' : 'internal') + '-links.json',
  JSON.stringify(
    {
      origin,
      checkedAt: new Date().toISOString(),
      pages: pages.length,
      internalReferences: checked,
      external: results.sort((a, b) => a.url.localeCompare(b.url)),
      errors,
    },
    null,
    2,
  ),
);
console.log(
  pages.length +
    ' HTML pages; ' +
    checked +
    ' internal references; ' +
    (external ? results.length : seenExternal.size) +
    (external ? ' external URLs checked.' : ' external URLs discovered.'),
);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
}
