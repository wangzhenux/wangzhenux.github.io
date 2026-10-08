import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-platform flagship: product-led funnel structure renders, no axe violations', async ({ page }) => {
  // Reveal-on-scroll fades would otherwise be sampled mid-transition by axe
  // (blended, not final, colors). The site honors reduced motion (§7), so the
  // a11y scan runs against the instant-reveal experience.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/unitpulse-platform');
  await expect(page.locator('.hero-title')).toContainText('UnitPulse Portal');

  // The 10-second layer: a real product hero + the user-oriented outcome.
  await expect(page.locator('.hero-cover img')).toHaveAttribute('src', /hero-cover\.png/);
  await expect(page.locator('.meta-strip')).toContainText('821 → 400 → 59');

  // The spine: Context + Parts 01–10 (eleven PartHeaders), with the product
  // chapters — generate demand → convert leads → optimize operations → answer
  // every call — in order, then the convergence and the design system.
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(11);
  await expect(parts.nth(2)).toContainText('Marketing: generate demand');
  await expect(parts.nth(3)).toContainText('Leasing: convert leads');
  await expect(parts.nth(4)).toContainText('Insight: optimize operations');
  await expect(parts.nth(5)).toContainText('Voice AI: answer every call');
  await expect(parts.nth(6)).toContainText('3 products to one platform');
  await expect(parts.nth(7)).toContainText('The design system');

  // What the AI does vs what people decide is a real, captioned table, and the
  // escalation ladder shows the 3 ways a call reaches a person.
  await expect(page.locator('#ctx table caption')).toContainText('what people decide');
  await expect(page.locator('#ctx table tbody tr')).toHaveCount(6);
  await expect(page.locator('#vc .lf-lane')).toHaveCount(3);

  // Nothing internal or client-identifying leaks onto the page.
  await expect(page.locator('body')).not.toContainText(/Odessia|Motor Tides|Retell|Twilio|Dify|Gemini/i);

  // The specimen wall renders its high-res tiles.
  await expect(page.locator('.wall-tile img[src*="ds/buttons.png"]')).toBeAttached();

  // The Feb→summer 2026 timeline (the one bespoke artifact) is present.
  await expect(page.locator('img[src*="timeline.svg"]')).toBeVisible();

  // The hidden deep-dive cases must NOT be linked from this page.
  await expect(page.locator('a[href="/work/up-insight"]')).toHaveCount(0);
  await expect(page.locator('a[href="/work/crm-copilot"]')).toHaveCount(0);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
