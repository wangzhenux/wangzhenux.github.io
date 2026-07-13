import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-platform flagship: product-led funnel structure renders, no axe violations', async ({ page }) => {
  // Reveal-on-scroll fades would otherwise be sampled mid-transition by axe
  // (blended, not final, colors). The site honors reduced motion (§7), so the
  // a11y scan runs against the instant-reveal experience.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/unitpulse-platform');
  await expect(page.locator('.hero-title')).toContainText('UnitPulse Platform');

  // The 10-second layer: a real product hero + the user-oriented outcome.
  await expect(page.locator('.hero-cover img')).toHaveAttribute('src', /hero-cover\.png/);
  await expect(page.locator('.meta-strip')).toContainText('79 accounts');

  // The spine: Context + Parts 01–08 (nine PartHeaders), with the funnel
  // chapters — generate demand → convert leads → optimize operations — in
  // order, then the convergence.
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(9);
  await expect(parts.nth(2)).toContainText('Marketing: generate demand');
  await expect(parts.nth(3)).toContainText('Leasing: convert leads');
  await expect(parts.nth(4)).toContainText('Insight: optimize operations');
  await expect(parts.nth(5)).toContainText('3 products to one platform');

  // The Feb→summer 2026 timeline (the one bespoke artifact) is present.
  await expect(page.locator('img[src*="timeline.svg"]')).toBeVisible();

  // The hidden deep-dive cases must NOT be linked from this page.
  await expect(page.locator('a[href="/work/up-insight"]')).toHaveCount(0);
  await expect(page.locator('a[href="/work/crm-copilot"]')).toHaveCount(0);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
