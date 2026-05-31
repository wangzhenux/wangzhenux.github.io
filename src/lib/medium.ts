import { XMLParser } from 'fast-xml-parser';

export interface MediumPost {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
  image: string | null;
}

const EXCERPT_MAX = 160;

/** Strip HTML tags and collapse whitespace into a plain-text string. */
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

/** Truncate to <= max chars at a word boundary, appending an ellipsis. */
function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  // Reserve one char for the ellipsis.
  const slice = text.slice(0, max - 1);
  const lastSpace = slice.lastIndexOf(' ');
  const cut = lastSpace > 0 ? slice.slice(0, lastSpace) : slice;
  return `${cut.replace(/[.,;:!?\s]+$/, '')}…`;
}

/** Extract the first <img src="..."> from an HTML string, or null. */
function firstImage(html: string): string | null {
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

/**
 * Parse a Medium RSS XML string into the most recent `limit` posts. Pure — no
 * network. Resilient to missing fields (returns sensible defaults).
 */
export function parseMediumFeed(xml: string, limit: number): MediumPost[] {
  const parser = new XMLParser({
    ignoreAttributes: true,
    // CDATA + entity content should come through as plain strings.
    processEntities: true,
  });
  const doc = parser.parse(xml);
  const channel = doc?.rss?.channel;
  if (!channel) return [];

  const rawItems = channel.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  return items.slice(0, limit).map((item: Record<string, unknown>): MediumPost => {
    const title = String(item.title ?? '').trim();
    const link = String(item.link ?? '').trim();
    const pubDate = String(item.pubDate ?? '').trim();
    const encoded = String(item['content:encoded'] ?? '');
    const excerpt = truncate(stripHtml(encoded), EXCERPT_MAX);
    const image = firstImage(encoded);
    return { title, link, pubDate, excerpt, image };
  });
}

/**
 * Fetch and parse the public Medium RSS feed for `handle` at build time.
 * Wrapped so any failure (network, non-OK status, parse error) yields `[]`,
 * keeping the build resilient (§6.4 graceful fallback).
 */
export async function fetchMedium(handle: string, limit = 3): Promise<MediumPost[]> {
  try {
    const res = await fetch(`https://medium.com/feed/@${handle}`);
    if (!res.ok) return [];
    const xml = await res.text();
    return parseMediumFeed(xml, limit);
  } catch {
    return [];
  }
}
