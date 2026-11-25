import {
  getCollection,
  type CollectionEntry,
  type CollectionKey,
} from 'astro:content';
import { pathFor, type Locale } from './i18n';

export const isPublic = ({
  data,
}: {
  data: { visibility: string; draft: boolean };
}) => data.visibility === 'public' && !data.draft;
export async function entries<C extends CollectionKey>(
  collection: C,
  lang: Locale,
) {
  const all = await getCollection(collection);
  return all
    .filter((entry) => isPublic(entry) && entry.data.lang === lang)
    .sort((a, b) => a.data.order - b.data.order || a.id.localeCompare(b.id));
}
export function entryUrl(entry: CollectionEntry<'notes' | 'projects'>) {
  return pathFor(
    entry.data.lang,
    `${entry.collection}/${entry.data.translationKey}`,
  );
}
export async function translationUrl(
  entry: CollectionEntry<'notes' | 'projects'>,
  lang: Locale,
) {
  const translated = (await entries(entry.collection, lang)).find(
    (item) => item.data.translationKey === entry.data.translationKey,
  );
  return translated ? entryUrl(translated) : pathFor(lang, entry.collection);
}
