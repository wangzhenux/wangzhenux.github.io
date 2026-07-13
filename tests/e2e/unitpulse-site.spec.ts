import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-site case: card-forward structure renders, no axe violations', async ({ page }) => {
  // Reveal-on-scroll fades would otherwise be sampled mid-transition by axe
  // (blended, not final, colors). The site honors reduced motion (§7), so the
  // a11y scan runs against the instant-reveal experience.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/unitpulse-site');
  await expect(page.locator('.hero-title')).toContainText('Built to Be Found');

  // Real product hero + honest outcome in the meta strip.
  await expect(page.locator('.hero-cover img')).toHaveAttribute('src', /welcome-hero\.jpg/);
  await expect(page.locator('.meta-strip')).toContainText('Live in production');

  // The spine: Context + Parts 01–06 (seven PartHeaders in document order).
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(7);
  await expect(parts.nth(1)).toContainText('The problem');
  await expect(parts.nth(6)).toContainText('Early traction');

  // Related work links to the featured UnitPulse siblings (CaseCard renders a
  // cover link and a title link per case, so match the first of each).
  await expect(page.locator('.related a[href="/work/unitpulse-platform"]').first()).toBeVisible();
  await expect(page.locator('.related a[href="/work/tour-scheduling"]').first()).toBeVisible();

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
