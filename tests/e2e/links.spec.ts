import { test, expect } from '@playwright/test';
import { existsSync, readdirSync, statSync } from 'node:fs';
import { resolve } from 'node:path';

test('every published page has valid internal links and section anchors', async ({ page }) => {
  const dist = resolve('dist');
  const files = readdirSync(dist, { recursive: true, encoding: 'utf8' })
    .filter((file) => file.endsWith('.html'));
  const pages = new Map<string, { links: string[]; ids: string[] }>();

  for (const file of files) {
    const route = `/${file.replace(/index\.html$/, '')}`;
    const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
    expect(response?.ok(), route).toBe(true);
    pages.set(resolve(dist, file), await page.evaluate(() => ({
      links: Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'), (a) => a.href),
      ids: Array.from(document.querySelectorAll('[id], a[name]'), (el) => el.id || el.getAttribute('name')!),
    })));
  }

  const origin = new URL(page.url()).origin;
  for (const [source, { links }] of pages) {
    for (const href of links) {
      const url = new URL(href);
      if (url.origin !== origin) continue;
      let target = resolve(dist, `.${decodeURIComponent(url.pathname)}`);
      if (existsSync(target) && statSync(target).isDirectory()) target = resolve(target, 'index.html');
      const context = `${source} links to ${href}`;
      expect(existsSync(target), context).toBe(true);
      if (url.hash && pages.has(target)) {
        expect(pages.get(target)!.ids, context).toContain(decodeURIComponent(url.hash.slice(1)));
      }
    }
  }
});
