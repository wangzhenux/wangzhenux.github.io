import { test } from '@playwright/test';

// Un-fixme in Phase 5 (Task 5.4) once /work/twilio exists.
test.fixme('TOC active state follows scroll', async ({ page }) => {
  await page.goto('/work/twilio');
});
