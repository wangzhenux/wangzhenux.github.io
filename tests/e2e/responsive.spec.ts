import { test, expect } from '@playwright/test';

// §9.1 / DESIGN.md §1 Layout: the sidebar TOC was removed — the body owns the full
// content frame and the fixed bottom progress bar is the section nav at ALL widths.
// The bar is held off-screen over the hero and slides in once
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
  await page.locator('.body section[id]').nth(1).evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect(page.locator('.progress-bar')).toHaveClass(/is-visible/);
}

for (const width of [375, 800, 1440]) {
  test(`at ${width}px: no sidebar TOC — the progress bar is the nav and slides in past the hero`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/work/twilio');

    // No sidebar at any width; the bottom bar is the only section nav.
    await expect(page.locator('.toc')).toHaveCount(0);
    await expect(page.locator('.progress-bar')).toHaveCount(1);

    // Held off-screen over the hero, revealed once the case content begins.
    await expect(page.locator('.progress-bar')).not.toHaveClass(/is-visible/);
    await revealProgressBar(page);
    expect(await page.locator('.progress-bar').evaluate(el => Math.abs(innerHeight - el.getBoundingClientRect().bottom))).toBeLessThanOrEqual(1);
  });
}

for (const slug of ['twilio', 'unitpulse-platform']) {
  test(`desktop drawer for ${slug}: sections read down each column in keyboard order`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/work/${slug}`);
    await revealProgressBar(page);

    const tag = page.locator('.progress-tag');
    const drawer = page.locator('#toc-drawer');
    await expect(tag).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toBeHidden();
    await tag.click();
    await expect(tag).toHaveAttribute('aria-expanded', 'true');
    await expect(drawer).toBeVisible();

    // Even and odd section counts fill the left column before the right.
    const items = drawer.locator('.toc-item--drawer');
    const first = await items.nth(0).boundingBox();
    const second = await items.nth(1).boundingBox();
    expect(first).not.toBeNull();
    expect(second).not.toBeNull();
    expect(Math.abs(second!.x - first!.x)).toBeLessThanOrEqual(2);
    expect(second!.y).toBeGreaterThan(first!.y);
    const split = Math.ceil(await items.count() / 2);
    const right = await items.nth(split).boundingBox();
    expect(Math.abs(right!.y - first!.y)).toBeLessThanOrEqual(2);
    expect(right!.x).toBeGreaterThan(first!.x + 8);
    const drawerBox = await drawer.boundingBox();
    const barBox = await page.locator('.progress-bar').boundingBox();
    expect(drawerBox!.y + drawerBox!.height).toBeLessThanOrEqual(barBox!.y + 1);

    for (let i = 0; i <= split; i++) {
      await page.keyboard.press('Tab');
      await expect(items.nth(i)).toBeFocused();
    }

    await tag.click();
    await expect(tag).toHaveAttribute('aria-expanded', 'false');
    await expect(drawer).toBeHidden();
  });
}

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

test('short mobile drawer scrolls to the last section and restores focus', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 480 });
  await page.goto('/work/unitpulse-platform');
  await revealProgressBar(page);
  const tag = page.locator('.progress-tag');
  const drawer = page.locator('#toc-drawer');
  await tag.click();
  expect(await drawer.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await drawer.locator('.toc-item--drawer').last().click();
  await expect(drawer).toBeHidden();
  await expect(tag).toBeFocused();
  await expect(page.locator('.progress-current')).toHaveText('11');
  await expect(page.locator('#p8')).toBeInViewport();
});

test('case navigation returns above the story and the bottom bar stops before Next case', async ({ page }) => {
  await page.goto('/work/unitpulse-platform');
  await revealProgressBar(page);
  const nav = page.getByRole('navigation', { name: 'Primary' });
  await expect.poll(() => nav.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(1);
  await page.evaluate(() => scrollBy({ top: -40, behavior: 'instant' }));
  await expect.poll(() => nav.evaluate(el => el.getBoundingClientRect().top)).toBe(0);
  await expect(page.locator('.progress-tag')).toBeInViewport();

  // An open drawer closes as soon as the next case enters the viewport.
  const tag = page.locator('.progress-tag');
  await tag.click();
  await expect(page.locator('#toc-drawer')).toBeVisible();
  await page.locator('.next-case-wrap').evaluate(el => {
    scrollTo({ top: scrollY + el.getBoundingClientRect().top - innerHeight + 24, behavior: 'instant' });
  });
  await expect(page.locator('.next-case')).toBeInViewport();
  await expect(tag).toBeHidden();
  await expect(page.locator('#toc-drawer')).toBeHidden();
  await expect(tag).toHaveAttribute('aria-expanded', 'false');

  // Scrolling back into the story restores the bar with the drawer closed.
  await revealProgressBar(page);
  await expect(tag).toBeVisible();
  await expect(page.locator('#toc-drawer')).toBeHidden();

  // A direct jump to the footer also hides it, even if it skips the boundary.
  await page.evaluate(() => scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
  await expect(page.locator('.footer-socials')).toBeInViewport();
  await expect(tag).toBeHidden();

  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  await expect(tag).toBeHidden();
});
