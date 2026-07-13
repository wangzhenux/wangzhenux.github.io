import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wangzhenux.github.io',
  // Respect the PORT env var (set by tooling like the Claude preview harness);
  // fall back to Astro's default 4321.
  server: { port: process.env.PORT ? Number(process.env.PORT) : 4321 },
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
  image: {
    domains: ['miro.medium.com', 'cdn-images-1.medium.com'],
  },
});
