import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export type CaseEntry = CollectionEntry<'cases'>;

const byOrder = (a: CaseEntry, b: CaseEntry) => a.data.order - b.data.order;

/** All published cases, sorted by `order` ascending. */
export async function getAllCases(): Promise<CaseEntry[]> {
  const cases = await getCollection('cases');
  return cases.filter((c) => !c.data.hidden).sort(byOrder);
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

/** Archived cases in curated `order` (ascending); the two academic flagships —
 *  TechScene, then T.E.A.M. Carpool — lead. Year breaks any tie. */
export async function getArchive(): Promise<CaseEntry[]> {
  const cases = await getCollection('cases');
  return cases
    .filter((c) => c.data.archive === true && !c.data.hidden)
    .sort((a, b) => a.data.order - b.data.order || b.data.year - a.data.year);
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

/** Map a case collection entry to the CaseCard prop shape: short card copy
 *  (with title/deck fallbacks), tag pills, brand flood color, logo, and the
 *  framed product shot (falls back to heroImage, then the legacy gradient
 *  cover). Shared by every place that renders a CaseCard from a CaseEntry, so
 *  the mapping can't drift out of sync between them. */
export function toCard(c: CaseEntry) {
  const card = c.data.card ?? {};
  return {
    slug: c.data.slug,
    title: card.title ?? c.data.title,
    lead: card.lead ?? c.data.deck,
    tags: card.tags,
    brand: card.brand,
    logo: card.logo,
    logoAlt: card.logoAlt ?? c.data.company,
    logoScale: card.logoScale,
    frame: card.frame,
    shot: card.shot ?? c.data.heroImage,
    cover: c.data.cover.gradient,
    coverImage: c.data.cover.image,
    company: c.data.company,
  };
}
