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

  // The spine: Context + Parts 01–11 (twelve PartHeaders). The convergence
  // story comes first, then the product chapters (generate demand → convert
  // leads → optimize operations → answer every call), the Copilot and the
  // design system.
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(12);
  await expect(parts.nth(2)).toContainText('Separate products, one platform');
  await expect(parts.nth(3)).toContainText('Marketing: generate demand');
  await expect(parts.nth(4)).toContainText('Leasing: convert leads');
  await expect(parts.nth(5)).toContainText('Insight: optimize operations');
  await expect(parts.nth(6)).toContainText('Voice AI: answer every call');
  await expect(parts.nth(7)).toContainText('Copilot');
  await expect(parts.nth(8)).toContainText('The design system');

  // The Copilot has its own part with its clip, and the escalation ladder
  // shows the 3 ways a call reaches a person.
  await expect(page.locator('#cp video[aria-label^="The Copilot"]')).toHaveCount(1);
  await expect(page.locator('#vc .lf-lane')).toHaveCount(3);

  // Nothing internal or client-identifying leaks onto the page.
  await expect(page.locator('body')).not.toContainText(/Odessia|Motor Tides|Retell|Twilio|Dify|Gemini/i);

  // The design-system showcase renders its specimens and switches to dark.
  await expect(page.locator('.dss img[src*="ds/system/buttons.png"]')).toBeAttached();
  await page.locator('.dss-btn[data-set="dark"]').click();
  await expect(page.locator('.dss')).toHaveAttribute('data-mode', 'dark');
  await page.locator('.dss-btn[data-set="light"]').click();

  // The Feb→summer 2026 timeline (the one bespoke artifact) is present.
  await expect(page.locator('img[src*="timeline.svg"]')).toBeVisible();

  // The hidden deep-dive cases must NOT be linked from this page.
  await expect(page.locator('a[href="/work/up-insight"]')).toHaveCount(0);
  await expect(page.locator('a[href="/work/crm-copilot"]')).toHaveCount(0);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});
