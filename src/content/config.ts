import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/** A single TOC section entry — drives the per-case sticky TOC (§3.3, §6.2). */
const sectionSchema = z.object({
  id: z.string(),
  num: z.string(),
  label: z.string(),
});

/** Cover: one of `gradient` OR `image` is required (§11.1). */
const coverSchema = z
  .object({
    gradient: z.string().optional(),
    image: z.string().optional(),
    // Intrinsic dimensions of `image` (for CLS-free reservation on the hero).
    width: z.number().optional(),
    height: z.number().optional(),
  })
  .refine((c) => Boolean(c.gradient || c.image), {
    message: 'cover requires `gradient` or `image`',
  });

/**
 * Standalone case-study front-matter schema (§11.1). Exported on its own so it
 * is directly unit-testable via `caseSchema.parse(...)`, independent of the
 * collection loader.
 */
export const caseSchema = z.object({
  // === REQUIRED on every case ===
  title: z.string(),
  deck: z.string(),
  slug: z.string(),
  year: z.number(),
  role: z.string(),
  cover: coverSchema,
  order: z.number(),
  featured: z.boolean(),
  sections: z.array(sectionSchema),

  // archive flag drives getArchive(); defaults to false
  archive: z.boolean().default(false),

  // hidden removes a case from the site entirely (no page built, no listing)
  // while keeping its MDX on disk for future restoration; defaults to false
  hidden: z.boolean().default(false),

  // === OPTIONAL — include only the fields the case actually has ===
  company: z.string().optional(),
  team: z.string().optional(),
  span: z.string().optional(),
  outcome: z
    .object({
      metric: z.string(),
      context: z.string().optional(),
    })
    .optional(),
  // Custom hero meta-strip rows. When present, they replace the auto-built
  // Role/Team/Span/Outcome strip — for cases whose snapshot doesn't map onto
  // those four labels. Rendered through the same MetaStrip component.
  meta: z.array(z.object({ label: z.string(), value: z.string(), sub: z.string().optional() })).optional(),
  // Product type for the standard meta strip (e.g. "Web app", "Mobile app", "Dashboard").
  type: z.string().optional(),
  class: z.string().optional(),
  // A real product screenshot for the case-page hero, distinct from the homepage
  // card `cover` (which may stay an abstract illustration). Falls back to cover.
  heroImage: z.string().optional(),
  heroAlt: z.string().optional(),
  heroWidth: z.number().optional(),
  heroHeight: z.number().optional(),
  collaborators: z.array(z.string()).optional(),
  status: z.enum(['shipped', 'in-design', 'planned']).optional(),
  liveUrl: z.string().optional(),
});

const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: caseSchema,
});

/** Minimal writing collection for the future in-house writing path (§6.4). */
export const writingSchema = z.object({
  title: z.string(),
  pubDate: z.coerce.date(),
  link: z.string(),
});

const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: writingSchema,
});

export const collections = { cases, writing };
