import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  // NOTE: since Astro 7, `astro preview` daemonises itself when it detects an
  // AI-agent environment (astro/dist/cli/preview/index.js -> isRunByAgent()),
  // and Playwright then reports "Process from config.webServer exited early".
  // CI and ordinary terminals are unaffected — it only trips when the suite is
  // launched from inside an agent. Work around it there with
  // `env -u CLAUDECODE npx playwright test`, or `astro preview stop` first.
  webServer: {
    command: 'npm run preview',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  use: { baseURL: 'http://localhost:4321' },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 375, height: 812 } } },
  ],
});
