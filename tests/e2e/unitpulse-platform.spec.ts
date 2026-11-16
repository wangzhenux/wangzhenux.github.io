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
  await expect(page.locator('.meta-strip')).toContainText('50+ properties on the platform');

  // The spine: Context, Parts 01–10 and a closing coda (twelve PartHeaders).
  // Who it serves, then the platform as the solution (with the AI agent map),
  // the product chapters (generate leads → convert leads → measure the
  // funnel → answer every call), the Copilot, the design system, the
  // agents' app as "One more thing", then evidence and reflection.
  const parts = page.locator('.part-title');
  await expect(parts).toHaveCount(12);
  await expect(parts.nth(2)).toContainText('3 products, one platform');
  await expect(parts.nth(3)).toContainText('Marketing: generate leads');
  await expect(parts.nth(4)).toContainText('Leasing: convert leads');
  await expect(parts.nth(5)).toContainText('Insight: measure the funnel');
  await expect(parts.nth(6)).toContainText('Voice AI: answer every call');
  await expect(parts.nth(7)).toContainText('Copilot');
  await expect(parts.nth(8)).toContainText('The design system');
  await expect(parts.nth(9)).toContainText('Leasing on the go');

  // The AI agent map: 11 AI stations (10 agents; the one Copilot is drawn on
  // both the Insight and Copilot lines), and a station opens its popover.
  await expect(page.locator('#agents .am-node[aria-label^="AI agent:"]')).toHaveCount(11);

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

  // The Feb→summer 2026 timeline (the one bespoke artifact) is drawn inline,
  // so it can draw itself on scroll.
  await expect(page.locator('.tl svg[role="img"]')).toBeVisible();

  // Walkthroughs: every step and screen is in the page (Marketing 5, Insight 6).
  await expect(page.locator('#mk-steps .wt-fig')).toHaveCount(5);
  await expect(page.locator('#in-steps .wt-fig')).toHaveCount(6);

  // The hidden deep-dive cases must NOT be linked from this page.
  await expect(page.locator('a[href="/work/up-insight"]')).toHaveCount(0);
  await expect(page.locator('a[href="/work/crm-copilot"]')).toHaveCount(0);

  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations, JSON.stringify(r.violations.map((v) => v.id))).toEqual([]);
});

test('phone walkthrough: the steps swipe sideways one card at a time, and the dots follow', async ({ page }) => {
  // Reduced motion: a dot moves the row at once instead of gliding.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/work/unitpulse-platform');

  const wt = page.locator('#mk-steps');
  const row = wt.locator('.wt-stage');
  const cards = wt.locator('.wt-step');
  const dots = wt.locator('.wt-dot');
  await wt.evaluate((el) => el.scrollIntoView({ block: 'center' }));

  // The 5 steps sit in one row that scrolls sideways, with a dot per step.
  expect(await row.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(true);
  await expect(dots).toHaveCount(5);
  await expect(dots.first()).toBeVisible();
  await expect(dots.first()).toHaveAttribute('aria-label', 'Step 1 of 5');
  await expect(dots.first()).toHaveAttribute('aria-current', 'true');

  // One card at a time: the first fits in the row, the next only peeks in.
  const box = (await row.boundingBox())!;
  const first = (await cards.nth(0).boundingBox())!;
  const second = (await cards.nth(1).boundingBox())!;
  expect(first.x + first.width).toBeLessThanOrEqual(box.x + box.width);
  const peek = box.x + box.width - second.x;
  expect(peek).toBeGreaterThan(0);
  expect(peek).toBeLessThan(second.width / 4);

  // Scrolling the row to the third card moves the dots there.
  await row.evaluate((el) => {
    const s = el.querySelectorAll('.wt-step');
    el.scrollTo({ left: s[2].getBoundingClientRect().left - s[0].getBoundingClientRect().left, behavior: 'instant' });
  });
  await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
  await expect(dots.first()).toHaveAttribute('aria-current', 'false');
  await expect(cards.nth(2)).toHaveClass(/is-active/);

  // Tapping a dot brings its card back to the start of the row.
  await dots.first().click();
  await expect.poll(() => row.evaluate((el) => el.scrollLeft)).toBe(0);
  await expect(dots.first()).toHaveAttribute('aria-current', 'true');

  // A title brings its card in and the page stays put, by tap or by Enter, and
  // a title reached with the keyboard keeps its focus.
  const y0 = await page.evaluate(() => window.scrollY);
  const t2 = (await wt.locator('.wt-link').nth(1).boundingBox())!;
  await page.mouse.click(box.x + box.width - 8, t2.y + t2.height / 2);
  await expect(dots.nth(1)).toHaveAttribute('aria-current', 'true');
  expect(await page.evaluate(() => window.scrollY)).toBe(y0);
  const t3 = wt.locator('.wt-link').nth(2);
  await t3.focus();
  await page.keyboard.press('Enter');
  await expect(dots.nth(2)).toHaveAttribute('aria-current', 'true');
  await expect(t3).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBe(y0);

  // Wide windows keep the pinned list: no swipe row and no dots.
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(dots.first()).toBeHidden();
  expect(await row.evaluate((el) => el.scrollWidth > el.clientWidth)).toBe(false);
});
