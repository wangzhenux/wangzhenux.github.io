import { test, expect } from '@playwright/test';

// The top progress bar is the section nav at all widths (§9.1 / DESIGN.md §1), so
// the scrollspy contract is now: scrolling updates the bar's "NN / NN · label" tag
// and marks the matching drawer item current; clicking a drawer item jumps to that
// section and pins it active. Runs on both projects — no desktop-only skip.

test('progress tag follows scroll and a drawer item click jumps', async ({ page }) => {
  // Reduced motion makes both the emulated scroll and the island's click-to-scroll
  // instant (behavior: auto), so assertions never race a smooth scroll.
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/work/twilio');

  // Scroll to section 05: the spy updates the tag and the drawer item's state.
  await page.locator('#s05').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect(page.locator('.progress-current')).toHaveText('05');
  await expect(page.locator('.progress-label')).toHaveText('A phased approach');
  await expect(page.locator('.toc-item--drawer[data-target="s05"]')).toHaveAttribute(
    'aria-current',
    'location'
  );

  // Click jump: open the drawer (visible now that the hero is scrolled past) and
  // choose section 02 — active state moves, the tag mirrors it, the page jumps.
  await expect(page.locator('.progress-bar')).toHaveClass(/is-visible/);
  await page.locator('.progress-tag').click();
  await page.locator('.toc-item--drawer[data-target="s02"]').click();
  await expect(page.locator('.toc-item--drawer[data-target="s02"]')).toHaveAttribute(
    'aria-current',
    'location'
  );
  await expect(page.locator('.progress-current')).toHaveText('02');
  await expect(page.locator('#s02')).toBeInViewport();
});
