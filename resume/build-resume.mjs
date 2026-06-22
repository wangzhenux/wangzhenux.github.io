// Renders resume/Zhen-Wang-Resume.html to public/Zhen-Wang-Resume.pdf as a
// single US-Letter page, using the Chromium bundled with @playwright/test.
// Run: node resume/build-resume.mjs
import { chromium } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const htmlPath = path.join(dir, 'Zhen-Wang-Resume.html');
const outPath = path.join(dir, '..', 'public', 'Zhen-Wang-Resume.pdf');

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto('file://' + htmlPath, { waitUntil: 'networkidle' });
  await page.pdf({
    path: outPath,
    format: 'Letter',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
  });
  console.log('Wrote', outPath);
} finally {
  await browser.close();
}
