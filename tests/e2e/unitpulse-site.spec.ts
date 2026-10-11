import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-site case: card-forward structure renders, no axe violations', async ({ page }) => {
  // Reveal-on-scroll fades would otherwise be sampled mid-transition by axe
  // (blended, not final, colors). The site honors reduced motion (§7), so the
  // a11y scan runs against the instant-reveal experience.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/unitpulse-site');
  await expect(page.locator('.hero-title')).toContainText('Home Search, in Your Own Words');

  // Real product hero + honest outcome in the meta strip.
  await expect(page.locator('.hero-cover img')).toHaveAttribute('src', /welcome-hero\.jpg/);
  await expect(page.locator('.meta-strip')).toContainText('Live in production');

  // The spine: Context + Parts 01–08 (nine PartHeaders in document order).
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(9);
  await expect(parts.nth(1)).toContainText('The problem');
  await expect(parts.nth(4)).toContainText('How the conversation works');
  await expect(parts.nth(7)).toContainText('Early traction');
  await expect(parts.nth(8)).toContainText('Reflection');

  // How it talks: the comparison is a real, captioned table; the flow has 6
  // stages; the storyboard and the fix stories render.
  await expect(page.locator('#cw table caption').first()).toContainText('Filters alone');
  await expect(page.locator('#cw .sf-col')).toHaveCount(6);
  await expect(page.locator('#cw .sb-block')).toHaveCount(5);
  await expect(page.locator('#cw .bk-card')).toHaveCount(6);

  // Nothing internal leaks onto the page.
  await expect(page.locator('body')).not.toContainText(/Odessia|Dify|Gemini|route_code/i);

  // Related work links to the flagship (tour-scheduling is hidden site-wide,
  // so it must NOT appear here).
  await expect(page.locator('.related a[href="/work/unitpulse-platform"]').first()).toBeVisible();
  await expect(page.locator('.related a[href="/work/tour-scheduling"]')).toHaveCount(0);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
