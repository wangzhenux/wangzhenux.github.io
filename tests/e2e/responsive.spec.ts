import { test, expect } from '@playwright/test';

// §9.1 / DESIGN.md §1 Layout: the sidebar TOC was removed — the body owns the full
// content frame and the fixed top progress bar is the section nav at ALL widths.
// The bar is held off-screen over the hero (translateY(-100%)) and slides in once
// the hero is scrolled past (the scrollspy island adds .is-visible). Its tag is a
// disclosure button toggling the #toc-drawer section list: a two-column grid above
// 700px, a single column below. Viewport sizes are driven directly so the
// assertions are meaningful regardless of which Playwright project runs the file.

test.beforeEach(async ({ page }) => {
  // The site honors reduced motion (§7): scrolls become instant and the bar's
  // slide-in transition collapses, so interactions never race an animation.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

/** Scroll past the hero so the fixed progress bar slides in and is interactive. */
async function revealProgressBar(page: import('@playwright/test').Page) {
  await page.locator('#s02').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect(page.locator('.progress-bar')).toHaveClass(/is-visible/);
}

for (const width of [375, 800, 1440]) {
  test(`at ${width}px: no sidebar TOC — the progress bar is the nav and slides in past the hero`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/twilio');

    // No sidebar at any width; the top bar is the only section nav.
    await expect(page.locator('.toc')).toHaveCount(0);
    await expect(page.locator('.progress-bar')).toHaveCount(1);

    // Held off-screen over the hero, revealed once the case content begins.
    await expect(page.locator('.progress-bar')).not.toHaveClass(/is-visible/);
    await revealProgressBar(page);
  });
}

test('desktop drawer: the progress tag toggles a two-column section list', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/work/twilio');
  await revealProgressBar(page);

  const tag = page.locator('.progress-tag');
  const drawer = page.locator('#toc-drawer');
  await expect(tag).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer).toBeHidden();
  await tag.click();
  await expect(tag).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toBeVisible();

  // Above 700px the list is a two-column grid: the first two items share a row.
  const items = drawer.locator('.toc-item--drawer');
  const first = await items.nth(0).boundingBox();
  const second = await items.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs(second!.y - first!.y)).toBeLessThanOrEqual(2);
  expect(second!.x).toBeGreaterThan(first!.x + 8);

  await tag.click();
  await expect(tag).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer).toBeHidden();
});

test('mobile drawer: tapping the progress tag toggles the section list', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/work/twilio');
  await revealProgressBar(page);

  const tag = page.locator('.progress-tag');
  const drawer = page.locator('#toc-drawer');
  await expect(tag).toHaveAttribute('aria-expanded', 'false');
  await expect(drawer).toBeHidden();
  await tag.click();
  await expect(tag).toHaveAttribute('aria-expanded', 'true');
  await expect(drawer).toBeVisible();

  // At/below 700px the list collapses to one column: the first two items stack.
  const items = drawer.locator('.toc-item--drawer');
  const first = await items.nth(0).boundingBox();
  const second = await items.nth(1).boundingBox();
  expect(first).not.toBeNull();
  expect(second).not.toBeNull();
  expect(Math.abs(second!.x - first!.x)).toBeLessThanOrEqual(2);
  expect(second!.y).toBeGreaterThan(first!.y);

  // A drawer item navigates, collapses the drawer, and the tag mirrors the section.
  await items.nth(2).click();
  await expect(drawer).toBeHidden();
  await expect(tag).toHaveAttribute('aria-expanded', 'false');
  await expect(page.locator('.progress-current')).toHaveText('03');
  await expect(page.locator('#s03')).toBeInViewport();
});
