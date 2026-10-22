import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-site case: card-forward structure renders, no axe violations', async ({ page }) => {
  // Reveal-on-scroll fades would otherwise be sampled mid-transition by axe
  // (blended, not final, colors). The site honors reduced motion (§7), so the
  // a11y scan runs against the instant-reveal experience.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/unitpulse-site');
  await expect(page.locator('.hero-title')).toContainText('Home Search, in Your Own Words');

  // Real product hero + the outcome in the meta strip.
  await expect(page.locator('.hero-cover img')).toHaveAttribute('src', /welcome-hero\.jpg/);
  await expect(page.locator('.meta-strip')).toContainText('Live in production');

  // The spine: Context + Parts 01–07 (eight PartHeaders in document order).
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(8);
  await expect(parts.nth(1)).toContainText('Invisible where renters start');
  await expect(parts.nth(2)).toContainText('One search, two ways in');
  await expect(parts.nth(3)).toContainText('How the conversation works');
  await expect(parts.nth(4)).toContainText('Fair Housing, tested');
  await expect(parts.nth(6)).toContainText('Early results');
  await expect(parts.nth(7)).toContainText('Reflection');

  // How it talks: the comparison is a real, captioned table; the 6-stage flow
  // sits behind a disclosure; the 3 fix stories render as static cards.
  await expect(page.locator('#cw table caption').first()).toContainText('Filters alone');
  await expect(page.locator('#cw details .sf-col')).toHaveCount(6);
  await expect(page.locator('#cw .bk-card')).toHaveCount(3);

  // Nothing internal leaks onto the page.
  await expect(page.locator('body')).not.toContainText(/Odessia|Dify|Gemini|route_code/i);

  // Related work links to the flagship (tour-scheduling is hidden site-wide,
  // so it must NOT appear here).
  await expect(page.locator('.related a[href="/work/unitpulse-platform"]').first()).toBeVisible();
  await expect(page.locator('.related a[href="/work/tour-scheduling"]')).toHaveCount(0);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
