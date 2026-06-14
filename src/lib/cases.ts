import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type CaseEntry = CollectionEntry<'cases'>;

const byOrder = (a: CaseEntry, b: CaseEntry) => a.data.order - b.data.order;

/** All cases, sorted by `order` ascending. */
export async function getAllCases(): Promise<CaseEntry[]> {
  const cases = await getCollection('cases');
  return cases.sort(byOrder);
}

/** Featured, non-archive cases sorted by `order` ascending. */
async function getFeaturedAll(): Promise<CaseEntry[]> {
  const cases = await getAllCases();
  return cases.filter((c) => c.data.featured && !c.data.archive);
}

/** The single homepage spotlight: lowest-order featured non-archive case. */
export async function getFeatured(): Promise<CaseEntry | undefined> {
  const featured = await getFeaturedAll();
  return featured[0];
}

/** Featured non-archive cases excluding the spotlight (the selected lineup). */
export async function getSelected(): Promise<CaseEntry[]> {
  const featured = await getFeaturedAll();
  return featured.slice(1);
}

/** Archived cases, sorted by year descending (most recent first); `order` breaks ties. */
export async function getArchive(): Promise<CaseEntry[]> {
  const cases = await getCollection('cases');
  return cases
    .filter((c) => c.data.archive === true)
    .sort((a, b) => b.data.year - a.data.year || a.data.order - b.data.order);
}

/**
 * The next non-archive case by `order` after the given slug, wrapping to the
 * first. Returns undefined if there are no non-archive cases.
 */
export async function getNext(slug: string): Promise<CaseEntry | undefined> {
  const cases = (await getAllCases()).filter((c) => !c.data.archive);
  if (cases.length === 0) return undefined;
  const idx = cases.findIndex((c) => c.data.slug === slug);
  if (idx === -1) return cases[0];
  return cases[(idx + 1) % cases.length];
}
