import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wangzhenux.github.io',
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
  image: {
    domains: ['miro.medium.com', 'cdn-images-1.medium.com'],
  },
});
