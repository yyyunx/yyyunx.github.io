import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { isPublic, entryUrl } from '../lib/content';
import { locales, pathFor } from '../lib/i18n';

export const GET: APIRoute = async ({ site }) => {
  const fixed = locales.flatMap((lang) =>
    ['', 'projects', 'notes', 'about', 'research', 'resume'].map((path) =>
      pathFor(lang, path),
    ),
  );
  const content = [
    ...(await getCollection('projects')),
    ...(await getCollection('notes')),
  ]
    .filter(isPublic)
    .map(entryUrl);
  const urls = [...fixed, ...content]
    .map((path) => `<url><loc>${new URL(path, site).href}</loc></url>`)
    .join('');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
