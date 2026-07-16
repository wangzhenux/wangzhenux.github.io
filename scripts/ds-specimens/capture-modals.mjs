/**
 * Render the UnitPulse Listing lead-capture modals at 3x, transparent bg.
 *
 * The modal Figma nodes are only 448px native (get_screenshot can't upscale),
 * so we reproduce them from get_design_context (Tailwind + the design's real
 * fonts) and render at deviceScaleFactor 3 → crisp ~1464px-wide PNGs with a
 * transparent background (no grey backdrop). Output:
 *   public/cases/unitpulse-site/{inquire,tour}-modal.png
 *
 * Usage:  node scripts/ds-specimens/capture-modals.mjs
 * Needs network (Tailwind CDN, Google Fonts, Figma icon assets).
 */
import { chromium } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { existsSync, mkdirSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, '../../public/cases/unitpulse-site');
const PORT = 8770;

const MODALS = [
  { name: 'inquire-modal', file: 'modals/inquire.html' },
  { name: 'tour-modal', file: 'modals/tour.html' },
];

const MIME = { '.html': 'text/html' };
const server = createServer(async (req, res) => {
  try {
    const body = await readFile(join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname)));
    res.writeHead(200, { 'content-type': MIME[extname(req.url)] ?? 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404).end(); }
});
await new Promise((ok) => server.listen(PORT, ok));

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const m of MODALS) {
  const ctx = await browser.newContext({ viewport: { width: 560, height: 900 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  await page.goto(`http://localhost:${PORT}/${m.file}`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400); // let Tailwind CDN + webfonts settle
  const el = await page.$('body > div'); // the padded wrapper (card + shadow room)
  await el.screenshot({ path: join(OUT, `${m.name}.png`), omitBackground: true });
  const box = await el.boundingBox();
  console.log(`✓ ${m.name}.png  (${Math.round(box.width)}×${Math.round(box.height)} @3x → ${Math.round(box.width * 3)}px)`);
  await ctx.close();
}
await browser.close();
server.close();
