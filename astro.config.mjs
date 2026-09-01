import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wangzhenux.github.io',
  // Respect the PORT env var (set by tooling like the Claude preview harness);
  // fall back to Astro's default 4321.
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  integrations: [mdx(), sitemap()],
  // Astro 7 changed this default to 'jsx', which drops whitespace adjacent to a
  // tag. That eats the space in prose like `and I like\n<strong>…</strong>`,
  // rendering "I likemaking dense…". Keep the pre-v7 collapsing behaviour the
  // layouts were built against; where a space between two expressions matters,
  // make it explicit in the source rather than relying on the compressor.
  compressHTML: true,
  build: { format: 'directory' },
  image: {
    domains: ['miro.medium.com', 'cdn-images-1.medium.com'],
  },
});
