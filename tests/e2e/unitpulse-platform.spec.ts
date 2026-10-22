import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('unitpulse-platform flagship: platform story renders, no axe violations', async ({ page }) => {
  // Reveal-on-scroll fades would otherwise be sampled mid-transition by axe
  // (blended, not final, colors). The site honors reduced motion (§7), so the
  // a11y scan runs against the instant-reveal experience.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/unitpulse-platform');
  await expect(page.locator('.hero-title')).toContainText('UnitPulse Portal');

  // The 10-second layer: a real product hero + the platform outcome.
  await expect(page.locator('.hero-cover img')).toHaveAttribute('src', /hero-cover\.png/);
  await expect(page.locator('.meta-strip')).toContainText('3 products → 1 platform');

  // The spine: Context + Parts 01–07 (eight PartHeaders). One story — separate
  // products → one platform → how AI and people share control → the agents'
  // app → the design system → results — instead of a chapter per product.
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(8);
  await expect(parts.nth(1)).toContainText('Fast products, drifting apart');
  await expect(parts.nth(2)).toContainText('One login, one navigation');
  await expect(parts.nth(3)).toContainText('How AI and people share control');
  await expect(parts.nth(4)).toContainText('tour recording first');
  await expect(parts.nth(5)).toContainText('One design system');
  await expect(parts.nth(6)).toContainText("What it's done so far");
  await expect(parts.nth(7)).toContainText('Reflection');

  // The AI agent map: 10 AI stations. Its rules are illustrated by one story
  // each from Leasing and Marketing, and the Voice AI callback fix.
  await expect(page.locator('#agents .am-node[aria-label^="AI agent:"]')).toHaveCount(10);
  await expect(page.locator('#ai .sb-block')).toHaveCount(2);
  await expect(page.locator('#ai .bk-card')).toHaveCount(1);

  // Nothing internal or client-identifying leaks onto the page.
  await expect(page.locator('body')).not.toContainText(/Odessia|Motor Tides|Retell|Twilio|Dify|Gemini/i);

  // The design-system specimens sit behind a disclosure; opened, they render
  // and switch to dark.
  await page.locator('#ds details summary').click();
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
