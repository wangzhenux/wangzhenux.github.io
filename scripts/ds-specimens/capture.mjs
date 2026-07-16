/**
 * Capture UnitPulse design-system specimens as high-res PNGs.
 *
 * Renders specimen pages (extracted from the UnitPulse Design System artifact,
 * plus composed tiles in tiles/) with Playwright at deviceScaleFactor 3 and
 * screenshots the COMPLETE specimen element — nothing clipped mid-component.
 * Output: public/cases/unitpulse-platform/ds/<name>.png (2100px wide).
 *
 * Usage:  node scripts/ds-specimens/capture.mjs
 */
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { extname, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, '../../public/cases/unitpulse-platform/ds');
const PORT = 8765;

/** Each capture: full-bounds screenshot of `sel` (defaults to .card → .wrap → body). */
const CAPTURES = [
  { name: 'buttons', file: 'tiles/buttons.html', sel: '.tile' },
  { name: 'kpi', file: 'preview/components-kpi.html', sel: '.wrap' },
  { name: 'chips', file: 'preview/components-chips.html' },
  { name: 'forms', file: 'tiles/forms.html', sel: '.tile' },
  { name: 'funnel', file: 'preview/components-funnel.html' },
  { name: 'table', file: 'preview/components-table.html' },
  { name: 'nav', file: 'preview/components-nav.html' },
  { name: 'donut', file: 'tiles/donut.html', sel: '.tile' },
  { name: 'colors', file: 'preview/colors-brand.html' },
  { name: 'type-scale', file: 'preview/type-scale.html' },
  { name: 'empty', file: 'preview/components-empty.html' },
  // Dark pair — same specimens, token-flipped via ?theme=dark.
  { name: 'kpi-dark', file: 'preview/components-kpi.html', sel: '.wrap', dark: true },
  { name: 'buttons-dark', file: 'tiles/buttons.html', sel: '.tile', dark: true },
];

/* The preview pages' LOCAL demo styles hard-code a few light-mode colors
   (.k-val, .lbl, .k-foot, svg.ic, .col-label). The component library itself is
   token-clean, so on dark captures we remap those to their token equivalents. */
const DARK_FIXES = `
  .k-val { color: var(--ink) !important; }
  .k-head .lbl { color: var(--subtle) !important; }
  .k-foot { color: var(--faint) !important; }
  svg.ic { stroke: var(--subtle) !important; }
  .col-label { color: var(--subtle) !important; }
`;

const MIME = { '.html': 'text/html', '.css': 'text/css', '.ttf': 'font/ttf', '.svg': 'image/svg+xml', '.js': 'text/javascript' };

const server = createServer(async (req, res) => {
  try {
    const path = join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    const body = await readFile(path);
    res.writeHead(200, { 'content-type': MIME[extname(path)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});
await new Promise((ok) => server.listen(PORT, ok));

if (!existsSync(OUT)) mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch();
for (const cap of CAPTURES) {
  const ctx = await browser.newContext({ viewport: { width: 700, height: 2200 }, deviceScaleFactor: 3 });
  const page = await ctx.newPage();
  const url = `http://localhost:${PORT}/${cap.file}${cap.dark ? '?theme=dark' : ''}`;
  await page.goto(url, { waitUntil: 'networkidle' });
  // Deterministic frames: no animations; specimen only (no gallery page header).
  await page.addStyleTag({
    content: `*{animation:none!important;transition:none!important} .page-head{display:none!important}${cap.dark ? DARK_FIXES : ''}`,
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(150);
  const el = cap.sel
    ? await page.$(cap.sel)
    : ((await page.$('.card')) ?? (await page.$('.wrap')) ?? (await page.$('body')));
  await el.screenshot({ path: join(OUT, `${cap.name}.png`) });
  const box = await el.boundingBox();
  console.log(`✓ ${cap.name}.png  (${Math.round(box.width)}×${Math.round(box.height)} @3x)`);
  await ctx.close();
}
await browser.close();
server.close();
