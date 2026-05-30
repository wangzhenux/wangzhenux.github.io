# Portfolio Revamp Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate `wangzhenux.github.io` from webpack+React to Astro+MDX, rebuilt against the "Warm Editorial Pro" Story-led design, so new case studies ship in under an hour from a single MDX file.

**Architecture:** Astro static site. Vanilla CSS driven entirely by design tokens (no CSS-in-JS). Reusable `.astro` components form a kit; each case study is an MDX file in a content collection that imports the components it needs. Interactive behavior (TOC scrollspy, lightbox, marker hover) ships as small client-side islands hydrated lazily. Builds to `dist/`, deployed unchanged by the existing GitHub Actions → GitHub Pages workflow.

**Tech Stack:** Astro 5, MDX, vanilla CSS with custom properties, Vitest + Astro Container API (component unit tests), Playwright + `@axe-core/playwright` (E2E + accessibility), Lighthouse CI (performance/a11y budgets). Node 22.

**Source of truth for component code:** the committed mockups at `docs/superpowers/specs/mockups/` — primarily `case-study-twilio.html` (case study + every data/showcase component), `homepage.html` (homepage + featured/selected), `about-resume.html` (about page). When a task says "port the `.X` CSS from the mockup," open that file, search for the literal selector, and copy the rule block, applying the listed token/a11y transformations.

**Spec reference:** `docs/superpowers/specs/2026-05-04-portfolio-revamp-design.md`. Section numbers below (e.g. §7.5) refer to it.

**Working directory:** the `feat/portfolio-revamp` worktree at `/Users/wangzhen/Documents/GitHub/wangzhenux.github.io-revamp`. All commands assume this is the cwd.

---

## Conventions used in every task

- **Token rule (§4.3, §12.3):** no hardcoded color/spacing/shadow/font values inside any component's CSS. Every value reads a custom property (`var(--space-6)`, `var(--ink-primary)`, etc.). When porting from a mockup, replace each literal with the matching token. A grep gate in Task 10.6 enforces this.
- **Commit cadence:** every task ends with a commit. Messages use Conventional Commits (`feat:`, `test:`, `chore:`, `refactor:`).
- **Co-author trailer** on every commit:
  ```
  Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
  ```
- **Test-first where there is logic:** RSS parsing, scrollspy section-selection, lightbox focus management, frontmatter schema all get a failing test before implementation. Pure-presentational component ports are verified by a render-snapshot test (assert key classes/structure present) plus the build passing.
- **"Verify build"** always means: `npm run build` exits 0.

---

## File structure (created by this plan)

```
astro.config.mjs                      Astro config (MDX, sitemap, view transitions)
package.json                          Rewritten: Astro scripts + deps
tsconfig.json                         Astro's strict base
vitest.config.ts                      Component unit tests (Container API)
playwright.config.ts                  E2E + a11y
lighthouserc.cjs                      Lighthouse CI budgets
src/
  styles/
    tokens.css                        §4.1 colors + §4.3 spacing + dark-prepared block
    global.css                        reset, typography, reduced-motion, base element styles
  layouts/
    BaseLayout.astro                  <html><head> chrome, meta, view transitions, skip-link
  components/
    chrome/
      Nav.astro                       §7.1 top nav + mobile hamburger
      Footer.astro                    §7.1 minimal footer
      BackLink.astro                  §7.1 "← All work"
    layout/
      BodyWrap.astro                  §7.1 body + sticky TOC flex container
      Toc.astro                       §7.1/7.2 sticky right-side TOC markup
    hero/
      Hero.astro                      §7.3 eyebrow + title + deck + cover
      Cover.astro                     §7.3 cover image, reads --case-cover
      MetaStrip.astro                 §7.3 auto-fit Role/Team/Span/Outcome <dl>
    reading/
      Lede.astro  BodyText.astro  SectionH.astro  SectionDeck.astro
      Pullquote.astro  Figure.astro                     §7.4
    data/
      CardRow.astro  PainCard.astro                     §7.5
      Competitors.astro  Competitor.astro               §7.5
      ResearchStats.astro  Stat.astro                   §7.5
      QuoteRow.astro  QuoteCard.astro                   §7.5
      IdeasList.astro                                    §7.5
      Dual.astro  DualCol.astro                          §7.5
      Phase.astro                                        §7.5
    showcase/
      ImageShowcase.astro             §7.6 full-bleed dotted-grid band
      Outcome.astro                   §7.6 big metric
      Reflection.astro  ReflectionCard.astro             §7.6
      Critique.astro                  §7.6 text-left/image-right rows
      NextCase.astro                  §7.6 next-case footer link
    home/
      Featured.astro  SelectedGrid.astro  CaseCard.astro
      Archive.astro  WritingList.astro
    about/
      CvCallout.astro  WorkHistory.astro  EducationPractice.astro  ReachMe.astro
  islands/
    toc-scrollspy.ts                  §8.2/8.3 scrollspy + click-scroll + showcase fade
    lightbox.ts                       §8.4 native <dialog> lightbox
  lib/
    medium.ts                         §6.4 build-time RSS fetch + parse
    cases.ts                          content-collection query helpers (featured/selected/archive)
  content/
    config.ts                         §11.1 case + writing collection schemas
    cases/
      twilio.mdx                      §3.3 proof-of-concept case
      tasktop-hub.mdx  tasktop-viz.mdx  rackspace-servicenow.mdx  park-engagement.mdx
      ilab.mdx  citportal.mdx  ...     archive cases (lighter)
  pages/
    index.astro                       homepage
    about.astro                       about / CV
    work/[slug].astro                 case study dynamic route
    writing/index.astro               writing index (Medium-backed)
tests/
  unit/                               Vitest component + lib tests
  e2e/                                Playwright specs
public/
  cases/<slug>/...                    case images (migrated from existing public/*)
  seal.svg                            calligraphic seal (Zhen uploads; fallback until then)
```

---

# Phase 0 — Astro scaffold & CI

### Task 0.1: Replace webpack toolchain with Astro

**Files:**
- Modify: `package.json` (full rewrite of deps + scripts)
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Delete: `webpack.common.js`, `webpack.dev.js`, `webpack.prod.js`, `babel.config.js`, `postcss.config.js` (defer deletion of `src/` until Phase 11 so old content stays readable as a reference)

- [ ] **Step 1: Write the new package.json**

Replace the entire file with:

```json
{
  "name": "wangzhenux-portfolio",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "start": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test",
    "lhci": "lhci autorun"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0"
  },
  "devDependencies": {
    "vitest": "^2.0.0",
    "linkedom": "^0.18.0",
    "@playwright/test": "^1.48.0",
    "@axe-core/playwright": "^4.10.0",
    "@lhci/cli": "^0.14.0",
    "fast-xml-parser": "^4.5.0"
  }
}
```

- [ ] **Step 2: Remove the old `.npmrc` legacy flag and old lockfile**

Run:
```bash
rm -f .npmrc package-lock.json
```
(The React/MUI peer-dep conflict that required `legacy-peer-deps` is gone with the new deps.)

- [ ] **Step 3: Write astro.config.mjs**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://wangzhenux.github.io',
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
  image: {
    // allow remote Medium thumbnail domains for build-time optimization
    domains: ['miro.medium.com', 'cdn-images-1.medium.com'],
  },
});
```

- [ ] **Step 4: Write tsconfig.json**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 5: Install and verify the toolchain resolves**

Run:
```bash
npm install
```
Expected: completes with no peer-dependency errors (the conflict that needed `legacy-peer-deps` is gone).

- [ ] **Step 6: Delete the webpack/babel config files**

Run:
```bash
rm -f webpack.common.js webpack.dev.js webpack.prod.js babel.config.js postcss.config.js
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: replace webpack toolchain with Astro scaffold

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 0.2: Minimal BaseLayout + index that builds

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Write a minimal BaseLayout**

```astro
---
interface Props { title: string; description?: string; }
const { title, description = "Zhen Wang — Senior Product Designer" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 2: Write a placeholder index**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Zhen Wang — Portfolio">
  <main><h1>Hello from Astro</h1></main>
</BaseLayout>
```

- [ ] **Step 3: Verify build**

Run: `npm run build`
Expected: exits 0; `dist/index.html` exists and contains "Hello from Astro".

- [ ] **Step 4: Verify dev server boots**

Run: `npm run dev` (then Ctrl-C after it prints a local URL)
Expected: prints `Local http://localhost:4321/` with no errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: minimal Astro base layout and index that builds

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 0.3: Test harness — Vitest + Playwright + axe + Lighthouse CI

**Files:**
- Create: `vitest.config.ts`, `playwright.config.ts`, `lighthouserc.cjs`
- Create: `tests/unit/smoke.test.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Write vitest.config.ts (Astro Container API)**

```ts
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  test: {
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

- [ ] **Step 2: Write a failing component smoke test**

`tests/unit/smoke.test.ts`:
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import BaseLayout from '../../src/layouts/BaseLayout.astro';

test('BaseLayout renders the title into <title>', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BaseLayout, {
    props: { title: 'Test Title' },
    slots: { default: '<p>body</p>' },
  });
  expect(html).toContain('<title>Test Title</title>');
  expect(html).toContain('<p>body</p>');
});
```

- [ ] **Step 3: Run it — expect PASS** (BaseLayout already exists from 0.2)

Run: `npm test`
Expected: 1 passed. (This validates the harness wiring, not new code.)

- [ ] **Step 4: Write playwright.config.ts**

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
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
```

- [ ] **Step 5: Write an E2E + axe smoke spec**

`tests/e2e/smoke.spec.ts`:
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('home page loads and has no axe violations', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

- [ ] **Step 6: Build, install browsers, run E2E**

Run:
```bash
npm run build && npx playwright install --with-deps chromium && npm run test:e2e
```
Expected: 1 passed (×2 projects). If axe flags missing `lang` or contrast, fix BaseLayout before moving on.

- [ ] **Step 7: Write lighthouserc.cjs**

```cjs
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: ['http://localhost/index.html'],
    },
    assert: {
      assertions: {
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:performance': ['warn', { minScore: 0.9 }],
      },
    },
  },
};
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "test: wire Vitest container, Playwright+axe, Lighthouse CI

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 0.4: Add CI test step to the deploy workflow

**Files:**
- Modify: `.github/workflows/deploy.yml`

- [ ] **Step 1: Add a test step before build**

In the `build` job, after the "Install dependencies" step and before "Build", insert:
```yaml
      - name: Unit tests
        run: npm test
```
Leave everything else (`npm ci`, `npm run build`, artifact upload of `./dist`, Pages deploy) unchanged — Astro outputs `dist/` so the publish step needs no edit.

- [ ] **Step 2: Verify workflow YAML parses**

Run: `npx --yes js-yaml .github/workflows/deploy.yml > /dev/null && echo OK`
Expected: `OK`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: run unit tests before build

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

# Phase 1 — Design foundation (tokens, type, global)

### Task 1.1: Design tokens

**Files:**
- Create: `src/styles/tokens.css`
- Test: `tests/unit/tokens.test.ts`

- [ ] **Step 1: Write a failing test asserting required tokens exist**

`tests/unit/tokens.test.ts`:
```ts
import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const css = readFileSync('src/styles/tokens.css', 'utf8');

test.each([
  '--bg-primary', '--bg-secondary', '--bg-inverse', '--stage-bg',
  '--ink-primary', '--ink-secondary', '--ink-tertiary', '--ink-quaternary',
  '--accent', '--accent-soft', '--accent-medium', '--highlight',
  '--rule', '--rule-soft', '--shadow-card', '--shadow-hover', '--shadow-frame',
  '--space-0', '--space-7', '--space-14',
  '--pad-page-x', '--pad-section-y', '--gap-body-toc', '--max-body', '--max-toc',
  '--font-display', '--font-body', '--font-mono',
])('token %s is defined', (token) => {
  expect(css).toContain(token + ':');
});

test('ink-tertiary uses the AA-corrected value', () => {
  expect(css).toContain('--ink-tertiary: #1A1410B8');
});

test('dark-mode prepared block exists but is commented or gated', () => {
  expect(css).toMatch(/prefers-color-scheme:\s*dark/);
});
```

- [ ] **Step 2: Run it — expect FAIL** (file does not exist)

Run: `npm test -- tokens`
Expected: FAIL — cannot read `src/styles/tokens.css`.

- [ ] **Step 3: Write tokens.css**

Copy the `:root` blocks verbatim from spec §4.1 (colors/shadows) and §4.3 (spacing scale + semantic aliases), then add the font tokens from §4.2 and the dark-prepared block from §4.1. Full file:

```css
:root {
  /* === Surface === */
  --bg-primary: #FAF5E8;
  --bg-secondary: #F1E9D5;
  --bg-inverse: #181210;
  --stage-bg: #DDD3C2;

  /* === Ink === */
  --ink-primary: #1A1410;
  --ink-secondary: #1A1410E5;
  --ink-tertiary: #1A1410B8;   /* AA-corrected (was 88) */
  --ink-quaternary: #1A1410B0; /* decorative only */
  --ink-on-dark: #FAF5E8;

  /* === Accent === */
  --accent: #C8442E;
  --accent-soft: #C8442E14;
  --accent-medium: #C8442E55;
  --highlight: rgba(245, 200, 100, 0.7);

  /* === Rules === */
  --rule: #1A141018;
  --rule-soft: #1A14100E;

  /* === Shadows === */
  --shadow-card: 0 12px 30px -10px rgba(20, 14, 8, 0.16);
  --shadow-hover: 0 16px 36px -12px rgba(20, 14, 8, 0.18);
  --shadow-frame: 0 24px 60px -20px rgba(20, 14, 8, 0.18);

  /* === Spacing scale (4px base) === */
  --space-0: 0;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-7: 32px;
  --space-8: 40px;
  --space-9: 48px;
  --space-10: 56px;
  --space-11: 64px;
  --space-12: 80px;
  --space-13: 96px;
  --space-14: 128px;

  /* === Semantic spacing === */
  --pad-page-x: var(--space-10);
  --pad-section-y: var(--space-12);
  --pad-section-y-lg: var(--space-13);
  --gap-card-row: var(--space-7);
  --gap-body-toc: var(--space-11);
  --gap-grid: var(--space-4);
  --gap-stack: var(--space-6);
  --max-content: 1080px;
  --max-body: 880px;
  --max-toc: 144px;

  /* === Type families === */
  --font-display: 'Iowan Old Style', 'Charter', 'GT Sectra', Georgia, serif;
  --font-body: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: ui-monospace, 'SF Mono', 'Geist Mono', monospace;
}

/* === Dark variant — PREPARED, not enabled in v1 ===
   When ready, remove the `:root[data-theme="light"]` guard so this
   activates on prefers-color-scheme: dark. */
@media (prefers-color-scheme: dark) {
  :root[data-theme="dark"] {
    --bg-primary: #181210;
    --bg-secondary: #221C18;
    --bg-inverse: #0E0B08;
    --ink-primary: #F0E6D2;
    --ink-secondary: #F0E6D2E5;
    --ink-tertiary: #F0E6D2B8;
    --ink-quaternary: #F0E6D2B0;
    --accent: #E0573E;
  }
}
```

- [ ] **Step 4: Run it — expect PASS**

Run: `npm test -- tokens`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css tests/unit/tokens.test.ts
git commit -m "feat: design tokens (color, spacing, type) with AA + dark-prepared

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 1.2: Global stylesheet (reset, typography, reduced-motion)

**Files:**
- Create: `src/styles/global.css`
- Modify: `src/layouts/BaseLayout.astro` (import both stylesheets)

- [ ] **Step 1: Write global.css**

```css
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body {
  margin: 0;
  background: var(--bg-primary);
  color: var(--ink-primary);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
h1, h2, h3, h4 { font-family: var(--font-display); font-weight: 500; line-height: 1.15; letter-spacing: -0.018em; margin: 0; }
a { color: inherit; }
img { max-width: 100%; display: block; }

/* Visible focus ring on every interactive element (§10.1) */
a:focus-visible, button:focus-visible, [tabindex]:focus-visible, dialog:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
  border-radius: 3px;
}

/* Skip link (§10.1) */
.skip-link {
  position: absolute; left: -9999px; top: 0;
  background: var(--bg-inverse); color: var(--ink-on-dark);
  padding: var(--space-3) var(--space-4); z-index: 1000;
}
.skip-link:focus { left: var(--space-4); top: var(--space-4); }

/* Reduced motion (§8.5, §10.4) */
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

- [ ] **Step 2: Import global.css and add skip link + lang in BaseLayout**

Update `src/layouts/BaseLayout.astro`:
```astro
---
import '../styles/global.css';
interface Props { title: string; description?: string; }
const { title, description = "Zhen Wang — Senior Product Designer" } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
    <meta name="description" content={description} />
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Verify build + existing tests still pass**

Run: `npm run build && npm test`
Expected: build 0; tokens + smoke tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/styles/global.css src/layouts/BaseLayout.astro
git commit -m "feat: global stylesheet — reset, typography, focus, reduced-motion

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

# Phase 2 — Chrome & layout primitives

> Each component task follows the same shape: write a render test asserting the key structure/classes, run it red, port markup+CSS from the named mockup applying token substitutions, run it green, verify build, commit. The mockup is the code source; the test guards structure and the token rule.

### Task 2.1: Nav

**Files:**
- Create: `src/components/chrome/Nav.astro`
- Test: `tests/unit/nav.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Nav from '../../src/components/chrome/Nav.astro';

test('Nav renders name + three links inside a <nav>', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Nav);
  expect(html).toMatch(/<nav[\s>]/);
  expect(html).toContain('Zhen Wang');
  for (const label of ['Work', 'Writing', 'About']) expect(html).toContain(label);
});
```

- [ ] **Step 2: Run — expect FAIL** (`npm test -- nav`): cannot find Nav.astro.

- [ ] **Step 3: Implement Nav.astro**

Port the `.nav` / `.nav-name` / `.nav-links` CSS from `docs/superpowers/specs/mockups/homepage.html` (search `.nav {`). Apply token substitutions: `56px`→`var(--space-10)`, `22px`→`var(--space-5)`, ink colors→`var(--ink-primary)`, rule→`var(--rule)`. Links go to `/`, `/writing`, `/about`. Add a `currentPath` prop to mark the active link with `aria-current="page"`. Include the mobile hamburger markup (a `<button aria-expanded>` toggling a `<ul>`; behavior is CSS `:target`-free — use a tiny inline script island or `details`/`summary`). Use `<details class="nav-mobile">` for a no-JS-dependency drawer:

```astro
---
interface Props { currentPath?: string; }
const { currentPath = '/' } = Astro.props;
const links = [
  { href: '/', label: 'Work' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
];
const isActive = (href: string) =>
  href === '/' ? currentPath === '/' : currentPath.startsWith(href);
---
<nav class="nav" aria-label="Primary">
  <a class="nav-name" href="/">Zhen Wang</a>
  <ul class="nav-links">
    {links.map((l) => (
      <li><a href={l.href} aria-current={isActive(l.href) ? 'page' : undefined}>{l.label}</a></li>
    ))}
  </ul>
</nav>
<style>
  /* ported from homepage.html .nav, tokenized */
  .nav { display: flex; justify-content: space-between; align-items: baseline;
         padding: var(--space-5) var(--pad-page-x); border-bottom: 1px solid var(--rule); }
  .nav-name { font-family: var(--font-display); font-size: 18px; font-weight: 500; text-decoration: none; }
  .nav-links { display: flex; gap: var(--space-7); list-style: none; margin: 0; padding: 0; font-size: 13px; }
  .nav-links a { text-decoration: none; color: var(--ink-primary); }
  .nav-links a:hover { color: var(--accent); }
  .nav-links a[aria-current="page"] { color: var(--accent); }
  @media (max-width: 767px) {
    .nav-links { gap: var(--space-4); }
  }
</style>
```

- [ ] **Step 4: Run — expect PASS** (`npm test -- nav`).

- [ ] **Step 5: Verify build** (`npm run build`).

- [ ] **Step 6: Commit**

```bash
git add src/components/chrome/Nav.astro tests/unit/nav.test.ts
git commit -m "feat: Nav component

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2.2: Footer

**Files:**
- Create: `src/components/chrome/Footer.astro`
- Test: `tests/unit/footer.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Footer from '../../src/components/chrome/Footer.astro';

test('Footer has name, year, and three socials', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Footer);
  expect(html).toMatch(/<footer/);
  expect(html).toContain('Zhen Wang');
  for (const s of ['Email', 'LinkedIn', 'Instagram']) expect(html).toContain(s);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement Footer.astro**

Port `.footer` from `homepage.html` (search `.footer {`). Background `var(--bg-inverse)`, text `var(--ink-on-dark)`, padding `var(--space-10) var(--pad-page-x)`. Socials: `mailto:wangzhen614@gmail.com`, `https://www.linkedin.com/in/zhenwang614`, `https://www.instagram.com/zhen.wang/` (from existing `src/footer.tsx`). Use a build-time year:
```astro
---
const year = new Date().getFullYear();
const socials = [
  { label: 'Email', href: 'mailto:wangzhen614@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/zhenwang614' },
  { label: 'Instagram', href: 'https://www.instagram.com/zhen.wang/' },
];
---
<footer class="footer">
  <div class="footer-left"><span class="footer-name">Zhen Wang</span> <span class="footer-year">© {year}</span></div>
  <ul class="footer-socials">
    {socials.map((s) => <li><a href={s.href}>{s.label}</a></li>)}
  </ul>
</footer>
<style>/* ported + tokenized; see homepage.html .footer */</style>
```
Fill the `<style>` from the mockup with tokens.

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Verify build.**
- [ ] **Step 6: Commit** `feat: Footer component`.

---

### Task 2.3: BackLink + BodyWrap + Toc markup

**Files:**
- Create: `src/components/chrome/BackLink.astro`
- Create: `src/components/layout/BodyWrap.astro`
- Create: `src/components/layout/Toc.astro`
- Test: `tests/unit/layout.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Toc from '../../src/components/layout/Toc.astro';
import BodyWrap from '../../src/components/layout/BodyWrap.astro';

const sections = [
  { id: 's01', num: '01', label: 'The problem' },
  { id: 's02', num: '02', label: 'Looking around' },
];

test('Toc renders one focusable button per section with data-target', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Toc, { props: { sections } });
  expect(html).toMatch(/<aside[^>]*aria-label="Case study sections"/);
  expect((html.match(/<button[^>]*class="toc-item"/g) || []).length).toBe(2);
  expect(html).toContain('data-target="s01"');
});

test('BodyWrap centers body + slots a toc region', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(BodyWrap, {
    slots: { default: '<p>body</p>', toc: '<aside>toc</aside>' },
  });
  expect(html).toContain('<p>body</p>');
  expect(html).toContain('toc');
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement the three files**

`BackLink.astro` — `<a class="back" href="/">← All work</a>`, port `.back` CSS (mono, `var(--ink-tertiary)`, `var(--pad-page-x)`).

`Toc.astro` — port `.toc` / `.toc-list` / `.toc-item` from `case-study-twilio.html` (search `.toc {` then `.toc-item {`). **Apply §7.2 contract:** items are `<button type="button" class="toc-item" data-target={id}>` with `<span class="num">`. `border-left` lives on `.toc-list` (matches list height). Tokenize. Props:
```astro
---
interface Section { id: string; num: string; label: string; }
interface Props { sections: Section[]; }
const { sections } = Astro.props;
---
<aside class="toc" aria-label="Case study sections">
  <ul class="toc-list">
    {sections.map((s) => (
      <li><button type="button" class="toc-item" data-target={s.id}><span class="num">{s.num}</span>{s.label}</button></li>
    ))}
  </ul>
</aside>
<style>/* ported .toc / .toc-list / .toc-item, tokenized; focus-visible ring from global */</style>
```

`BodyWrap.astro` — flex container, `max-width: var(--max-content)`, body `flex: 0 1 var(--max-body)`, gap `var(--gap-body-toc)`, TOC slot `flex: 0 0 var(--max-toc)`. Named slots:
```astro
<div class="body-wrap">
  <div class="body"><slot /></div>
  <slot name="toc" />
</div>
<style>/* ported .body-wrap / .body, tokenized; body order:1, toc order:2 */</style>
```

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Verify build.**
- [ ] **Step 6: Commit** `feat: BackLink, BodyWrap, Toc layout primitives`.

---

# Phase 3 — Component library (§7)

> All Phase 3 tasks share the port template. Each: failing render test → port from `case-study-twilio.html` (unless noted) with token substitutions → green → build → commit. Props let MDX pass content. Where the mockup hardcodes Twilio content, replace with props/slots.

### Task 3.1: Hero + Cover + MetaStrip

**Files:**
- Create: `src/components/hero/Hero.astro`, `Cover.astro`, `MetaStrip.astro`
- Test: `tests/unit/hero.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import MetaStrip from '../../src/components/hero/MetaStrip.astro';
import Cover from '../../src/components/hero/Cover.astro';

test('MetaStrip auto-fits N fields as a <dl>', async () => {
  const c = await AstroContainer.create();
  const fields = [
    { label: 'Role', value: 'Senior PD' },
    { label: 'Span', value: '~3.5 months' },
  ];
  const html = await c.renderToString(MetaStrip, { props: { fields } });
  expect((html.match(/<dt/g) || []).length).toBe(2);
  expect(html).toContain('Role');
  expect(html).toContain('~3.5 months');
  expect(html).toContain('--meta-cols: 2');
});

test('Cover applies the per-case gradient via --case-cover', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Cover, {
    props: { caseCover: 'linear-gradient(135deg, #F22F46, #6B1F2E)', alt: 'cover' },
  });
  expect(html).toContain('--case-cover');
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement**

`MetaStrip.astro` — `<dl class="meta-strip">` with one `<div><dt>{label}</dt><dd>{value}</dd></div>` per field. Set `style={`--meta-cols: ${fields.length}`}` and CSS `grid-template-columns: repeat(var(--meta-cols), 1fr)`. Port `.meta-strip` CSS from `case-study-twilio.html`, tokenized. This satisfies §12.10 (auto-fit N children).

`Cover.astro` — props `caseCover?`, `image?`, `alt`. If `image`, render Astro `<Image>` (Task 4.4 wires optimization); else a `<div class="cover">` with `style={`--case-cover: ${caseCover}`}` and CSS `background: var(--case-cover)`. Aspect 16/8 desktop (responsive swaps in Phase 10).

`Hero.astro` — props `eyebrow`, `title`, `deck`, plus `cover` + `metaFields`. Composes eyebrow (mono), `<h1 class="hero-title">`, `<p class="hero-deck">`, `<Cover>`, `<MetaStrip>`. Bounded to `var(--max-content)`. Port `.hero*` CSS. Title size uses `clamp()` per §4.2/§9.3: `font-size: clamp(32px, 6vw, 56px)`.

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Verify build.**
- [ ] **Step 6: Commit** `feat: Hero, Cover, MetaStrip (auto-fit meta fields)`.

---

### Task 3.2: Reading components (Lede, BodyText, SectionH, SectionDeck, Pullquote, Figure)

**Files:**
- Create: `src/components/reading/{Lede,BodyText,SectionH,SectionDeck,Pullquote,Figure}.astro`
- Test: `tests/unit/reading.test.ts`

- [ ] **Step 1: Failing test**

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import SectionH from '../../src/components/reading/SectionH.astro';
import Pullquote from '../../src/components/reading/Pullquote.astro';

test('SectionH renders h2 by default, h3 with small variant', async () => {
  const c = await AstroContainer.create();
  const h2 = await c.renderToString(SectionH, { slots: { default: 'The problem' } });
  expect(h2).toMatch(/<h2[^>]*class="section-h"/);
  const h3 = await c.renderToString(SectionH, { props: { small: true }, slots: { default: 'Key findings' } });
  expect(h3).toMatch(/<h3[^>]*class="section-h section-h--small"/);
});

test('Pullquote is a blockquote', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Pullquote, { slots: { default: 'A quote' } });
  expect(html).toMatch(/<blockquote[^>]*class="pullquote"/);
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement the six components**

Each ports its CSS from `case-study-twilio.html`, tokenized, using the §7.4 HTML elements:
- `Lede.astro` → `<p class="lede"><slot/></p>`
- `BodyText.astro` → `<p class="body-text"><slot/></p>`. **Marker on `<strong>`** (§8.1): include the `.body-text strong` rule with the amber underline default + `:hover` expanding `background-size` to `100% 88%`; reduced-motion shows full marker (global block already kills the transition).
- `SectionH.astro` → prop `small`; renders `<h2>` or `<h3 class="section-h section-h--small">`. Includes the 28px accent rule pseudo-element (`::before`). This is the **only** accent rule kept (§ audit — it's a typographic accent, not card chrome).
- `SectionDeck.astro` → `<p class="section-deck"><slot/></p>` (italic display serif).
- `Pullquote.astro` → `<blockquote class="pullquote"><slot/></blockquote>` with left accent rail.
- `Figure.astro` → `<figure class="figure"><img.../><figcaption class="figure-caption">{caption}</figcaption></figure>`. Props `src`, `alt`, `caption`. Body-column width (not full-bleed).

- [ ] **Step 4: Run — expect PASS.**
- [ ] **Step 5: Verify build.**
- [ ] **Step 6: Commit** `feat: reading components (lede, body, headings, pullquote, figure)`.

---

### Task 3.3: CardRow + PainCard

**Files:** Create `src/components/data/CardRow.astro`, `PainCard.astro`; Test `tests/unit/cardrow.test.ts`

- [ ] **Step 1: Failing test** — assert `CardRow` wraps slots in `.card-row` and `PainCard` renders `.pain-card` with `<h4>` title + large `.num`.
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import PainCard from '../../src/components/data/PainCard.astro';

test('PainCard has num, h4 title, body', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(PainCard, {
    props: { num: '01', title: 'Lack of visibility' },
    slots: { default: 'Customers did not know the regions existed.' },
  });
  expect(html).toContain('class="pain-card"');
  expect(html).toContain('01');
  expect(html).toMatch(/<h4[^>]*>Lack of visibility/);
});
```
- [ ] **Step 2: Run — expect FAIL.**
- [ ] **Step 3: Implement.** Port `.card-row` + `.pain-card` from `case-study-twilio.html` (search `.card-row {`). No card chrome; full-row hairlines top+bottom; `.num` is large display serif in `var(--accent)`. `CardRow` is `<div class="card-row"><slot/></div>` (3-col grid, `gap: var(--gap-card-row)`). `PainCard` props `num`, `title`; body via slot.
- [ ] **Step 4: Run — expect PASS.** **Step 5: build.** **Step 6: commit** `feat: CardRow + PainCard`.

---

### Task 3.4: Competitors + Competitor

**Files:** Create `src/components/data/Competitors.astro`, `Competitor.astro`; Test `tests/unit/competitors.test.ts`

- [ ] **Step 1: Failing test** — `Competitor` renders top-aligned row with logo slot + Strength + Gap labels.
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Competitor from '../../src/components/data/Competitor.astro';

test('Competitor shows strength and gap', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Competitor, {
    props: { name: 'Plivo', strength: 'Guided tour', gap: 'No region framing' },
  });
  expect(html).toContain('Plivo');
  expect(html.toLowerCase()).toContain('strength');
  expect(html.toLowerCase()).toContain('gap');
});
```
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.competitors` + `.competitor` from `case-study-twilio.html`. `align-items: start` (top-aligned, § from review). Props `name`, `strength`, `gap`, optional `logo` (SVG slot). Logo placeholder = wordmark in brand color via a `color` prop until real SVGs land (§11.3). **Step 4: PASS → Step 5: build → Step 6: commit** `feat: Competitors row`.

---

### Task 3.5: ResearchStats + Stat

**Files:** Create `src/components/data/ResearchStats.astro`, `Stat.astro`; Test `tests/unit/researchstats.test.ts`

- [ ] **Step 1: Failing test** — `ResearchStats` sets `--cols` from a prop; `Stat` renders big number + label + bullet list.
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import ResearchStats from '../../src/components/data/ResearchStats.astro';

test('ResearchStats exposes --cols', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ResearchStats, { props: { cols: 2 }, slots: { default: '<div>x</div>' } });
  expect(html).toContain('--cols: 2');
});
```
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.research-stats` from `case-study-twilio.html`. Default `cols=3`; `style={`--cols: ${cols}`}`, CSS `grid-template-columns: repeat(var(--cols), 1fr)`. `Stat` props `num`, `label`; body slot supports the two-line bullet list (`.item` spans with dash bullets, from review). **Step 4–6: PASS, build, commit** `feat: ResearchStats + Stat (variable columns)`.

---

### Task 3.6: QuoteRow + QuoteCard

**Files:** Create `src/components/data/QuoteRow.astro`, `QuoteCard.astro`; Test `tests/unit/quotecard.test.ts`

- [ ] **Step 1: Failing test** — `QuoteCard` renders mono label, `<h4>` heading, italic quote.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.quote-row` + `.quote-card` from `case-study-twilio.html`. `QuoteCard` props `label`, `heading`; quote via slot. **Step 4–6.** Commit `feat: QuoteRow + QuoteCard`.

---

### Task 3.7: IdeasList

**Files:** Create `src/components/data/IdeasList.astro`; Test `tests/unit/ideaslist.test.ts`

- [ ] **Step 1: Failing test**
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import IdeasList from '../../src/components/data/IdeasList.astro';

test('IdeasList marks selected items and badges them', async () => {
  const c = await AstroContainer.create();
  const items = [
    { num: '01', text: 'Choose region when naming account' },
    { num: '03', text: 'One-pager between Ahoy and Dashboard', selected: true, badge: 'Tested' },
  ];
  const html = await c.renderToString(IdeasList, { props: { items } });
  expect(html).toContain('class="ideas-list"');
  expect((html.match(/class="[^"]*selected/g) || []).length).toBe(1);
  expect(html).toContain('Tested');
});
```
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.ideas-list` from `case-study-twilio.html` (search `.ideas-list {`). Props `items: {num, text, selected?, badge?}[]`. Selected rows get `.selected` (accent number + badge). **Step 4–6.** Commit `feat: IdeasList (considered → chosen)`.

---

### Task 3.8: Dual + DualCol

**Files:** Create `src/components/data/Dual.astro`, `DualCol.astro`; Test `tests/unit/dual.test.ts`

- [ ] **Step 1: Failing test** — `Dual` is a two-column grid; `DualCol` has an `<h4>` header + hairline-separated `.dual-item` rows.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.dual` + `.dual-col` + `.dual-item` from `case-study-twilio.html`. `DualCol` prop `heading`; items via slot. **Step 4–6.** Commit `feat: Dual findings/recommendations`.

---

### Task 3.9: Phase

**Files:** Create `src/components/data/Phase.astro`; Test `tests/unit/phase.test.ts`

- [ ] **Step 1: Failing test** — `Phase` renders the number + title + text + a `<dl class="phase-meta">` of audience/metric, with the image as a sibling `<slot name="image">` so the page can wrap it in `ImageShowcase`.
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Phase from '../../src/components/data/Phase.astro';

test('Phase renders number, title and meta dl', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Phase, {
    props: { num: '01', label: 'Phase 1 · Shipped', title: 'Ahoy', meta: [{ k: 'Audience', v: 'New customers' }] },
    slots: { default: '<p>desc</p>' },
  });
  expect(html).toContain('01');
  expect(html).toContain('Ahoy');
  expect(html).toMatch(/<dl[^>]*class="phase-meta"/);
  expect(html).toContain('Audience');
});
```
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.phase` + `.phase-meta` (`<dl>` 2-col) from `case-study-twilio.html`. Props `num`, `label`, `title`, `meta: {k,v}[]`; description via default slot. Text-only (the showcase image is placed by the page as a sibling, §7.5). **Step 4–6.** Commit `feat: Phase block`.

---

### Task 3.10: ImageShowcase

**Files:** Create `src/components/showcase/ImageShowcase.astro`; Test `tests/unit/imageshowcase.test.ts`

- [ ] **Step 1: Failing test** — full-bleed band, dotted-grid background, slot for the image; image carries `.zoomable` hook for the lightbox (Task 4.3).
```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import ImageShowcase from '../../src/components/showcase/ImageShowcase.astro';

test('ImageShowcase wraps slot in a full-bleed band', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ImageShowcase, { slots: { default: '<img src="/x.png" alt="x" />' } });
  expect(html).toContain('class="image-showcase"');
  expect(html).toContain('/x.png');
});
```
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.image-showcase` from `case-study-twilio.html` (search `.image-showcase {`). Keep the `margin-left:-50vw` full-bleed trick + `radial-gradient` dotted grid (28px desktop). Inner image constrained to body width, left-aligned. Add `data-zoomable` to the slotted image wrapper so the lightbox island can find it. **Step 4–6.** Commit `feat: ImageShowcase full-bleed band`.

---

### Task 3.11: Outcome

**Files:** Create `src/components/showcase/Outcome.astro`; Test `tests/unit/outcome.test.ts`

- [ ] **Step 1: Failing test** — big `.outcome-num` + supporting `.outcome-text`.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.outcome` from `case-study-twilio.html`. Props `metric`, supporting text via slot. `clamp()` the 160px number for mobile (§9.3). **Step 4–6.** Commit `feat: Outcome metric`.

---

### Task 3.12: Reflection + ReflectionCard

**Files:** Create `src/components/showcase/Reflection.astro`, `ReflectionCard.astro`; Test `tests/unit/reflection.test.ts`

- [ ] **Step 1: Failing test** — two-column; card has mono label + `<h4>` + body.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.reflection` + `.reflection-card` from `case-study-twilio.html`. `ReflectionCard` props `label`, `heading`; body slot. **Step 4–6.** Commit `feat: Reflection cards`.

---

### Task 3.13: Critique

**Files:** Create `src/components/showcase/Critique.astro`; Test `tests/unit/critique.test.ts`

- [ ] **Step 1: Failing test** — vertical stack; each row text-left/image-right; consistent label/heading/fix spacing.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.critique*` from `case-study-twilio.html` (the post-review version: vertical stack, `grid-template-columns: 1fr 1.3fr`, fixed inner spacing). Props per row: `label`, `heading`, `fix`, image slot. Image carries `data-zoomable`. **Step 4–6.** Commit `feat: Critique rows`.

---

### Task 3.14: NextCase

**Files:** Create `src/components/showcase/NextCase.astro`; Test `tests/unit/nextcase.test.ts`

- [ ] **Step 1: Failing test** — renders a link with next case title + deck.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.next-case` from `case-study-twilio.html`. Props `href`, `title`, `deck`. **Step 4–6.** Commit `feat: NextCase footer link`.

---

# Phase 4 — Interaction islands (§8)

### Task 4.1: TOC scrollspy + click-to-scroll island

**Files:**
- Create: `src/islands/toc-scrollspy.ts`
- Test: `tests/unit/scrollspy.test.ts` (pure selection logic), `tests/e2e/scrollspy.spec.ts` (behavior)

- [ ] **Step 1: Write the failing unit test for the pure section-picker**

Extract the "which section is active" decision into a pure function so it's testable without a DOM.
`tests/unit/scrollspy.test.ts`:
```ts
import { expect, test } from 'vitest';
import { pickActive } from '../../src/islands/toc-scrollspy';

test('pickActive returns the id with the highest ratio', () => {
  expect(pickActive([
    { id: 's01', ratio: 0.1 },
    { id: 's02', ratio: 0.6 },
    { id: 's03', ratio: 0.3 },
  ])).toBe('s02');
});

test('pickActive returns null when all ratios are zero', () => {
  expect(pickActive([{ id: 's01', ratio: 0 }])).toBe(null);
});
```

- [ ] **Step 2: Run — expect FAIL** (module/function missing).

- [ ] **Step 3: Implement toc-scrollspy.ts**

Export `pickActive` plus an `init()` that wires §8.2 + §8.3. Full logic: IntersectionObserver over `section[id]` (`rootMargin: '-25% 0px -50% 0px'`), maintain a ratio map, call `pickActive`, set `.active` + `aria-current="location"` on the matching `.toc-item[data-target]`. Lock the spy during click-driven scroll until `scrollend` (2s fallback). Seed initial active on load by computing the section whose top is closest to the viewport (do not rely on hardcoded `.active`, §12.7). Click handler smooth-scrolls (instant if `prefers-reduced-motion`). Second IntersectionObserver over `.image-showcase` toggles `.toc.hidden` and pauses `setActive` while hidden (§8.3). Add an `aria-live="polite"` visually-hidden region announcing the active section label (§12.8).

```ts
export interface Ratio { id: string; ratio: number; }
export function pickActive(ratios: Ratio[]): string | null {
  let best: string | null = null, bestR = 0;
  for (const { id, ratio } of ratios) if (ratio > bestR) { bestR = ratio; best = id; }
  return best;
}

export function init(): void {
  const toc = document.querySelector<HTMLElement>('.toc');
  const items = Array.from(document.querySelectorAll<HTMLButtonElement>('.toc-item'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.body section[id]'));
  if (!toc || !items.length || !sections.length) return;

  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.className = 'visually-hidden';
  document.body.appendChild(live);

  const byId = new Map(items.map((b) => [b.dataset.target!, b]));
  const ratios = new Map(sections.map((s) => [s.id, 0]));
  let locked = false, tocHidden = false;

  const setActive = (id: string | null) => {
    if (!id) return;
    items.forEach((b) => { b.classList.remove('active'); b.removeAttribute('aria-current'); });
    const el = byId.get(id);
    if (el) { el.classList.add('active'); el.setAttribute('aria-current', 'location'); live.textContent = el.textContent; }
  };

  const refresh = () => {
    if (locked || tocHidden) return;
    setActive(pickActive(Array.from(ratios, ([id, ratio]) => ({ id, ratio }))));
  };

  new IntersectionObserver((entries) => {
    for (const e of entries) ratios.set((e.target as HTMLElement).id, e.intersectionRatio);
    refresh();
  }, { rootMargin: '-25% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }).observe;
  sections.forEach((s) => {
    new IntersectionObserver((entries) => {
      for (const e of entries) ratios.set((e.target as HTMLElement).id, e.intersectionRatio);
      refresh();
    }, { rootMargin: '-25% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }).observe(s);
  });

  // showcase fade
  const showcases = document.querySelectorAll('.image-showcase');
  if (showcases.length) {
    const visible = new Set<Element>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
      tocHidden = visible.size > 0;
      toc.classList.toggle('hidden', tocHidden);
      if (!tocHidden) refresh();
    }, { rootMargin: '-15% 0px -15% 0px' });
    showcases.forEach((s) => io.observe(s));
  }

  // click-to-scroll with lock
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  items.forEach((btn) => btn.addEventListener('click', () => {
    const id = btn.dataset.target!;
    const target = document.getElementById(id);
    if (!target) return;
    setActive(id);
    locked = true;
    const release = () => { locked = false; };
    if ('onscrollend' in window) {
      window.addEventListener('scrollend', release, { once: true });
      setTimeout(release, 2000);
    } else setTimeout(release, 800);
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }));

  // seed initial
  const seed = sections.reduce((best, s) =>
    Math.abs(s.getBoundingClientRect().top) < Math.abs(best.getBoundingClientRect().top) ? s : best, sections[0]);
  setActive(seed.id);
}
```
Add `.visually-hidden` to `global.css` (clip-rect pattern). Add `.toc.hidden { opacity:0; visibility:hidden; pointer-events:none; transition: opacity .3s; }`.

- [ ] **Step 4: Run unit test — expect PASS** (`npm test -- scrollspy`).

- [ ] **Step 5: Write the E2E behavior test** (will pass once the case page exists in Phase 5 — mark it `test.fixme` now, un-fixme in Task 5.5). For now assert the module imports without error:
```ts
import { test, expect } from '@playwright/test';
test.fixme('TOC active state follows scroll', async ({ page }) => {
  await page.goto('/work/twilio');
  // un-fixme in Task 5.5
});
```

- [ ] **Step 6: Verify build.** Commit `feat: TOC scrollspy + click-scroll island`.

---

### Task 4.2: Lightbox island (native `<dialog>`)

**Files:**
- Create: `src/islands/lightbox.ts`
- Test: `tests/e2e/lightbox.spec.ts` (fixme until Phase 5)

- [ ] **Step 1: Implement lightbox.ts (§8.4)**

A single `<dialog>` appended once. Clicking any `[data-zoomable] img` opens it with that image cloned in, focus moves to the subtle × close button, Tab is trapped, Esc/outside-click/× closes, focus restores to the trigger. Close button: 32px, transparent, low-opacity cream glyph, hover tint `rgba(250,245,232,0.12)` (§8.4 post-review). `dialog::backdrop` dims. Respects reduced-motion.

```ts
export function init(): void {
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Enlarged image');
  dialog.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
    <figure class="lightbox-fig"><img alt="" /><figcaption class="lightbox-cap"></figcaption></figure>
    <p class="lightbox-hint">press esc · or click outside</p>`;
  document.body.appendChild(dialog);
  const img = dialog.querySelector('img')!;
  const cap = dialog.querySelector('.lightbox-cap')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-close')!;
  let lastTrigger: HTMLElement | null = null;

  const open = (src: string, alt: string, trigger: HTMLElement) => {
    lastTrigger = trigger; img.src = src; img.alt = alt; cap.textContent = alt;
    dialog.showModal(); closeBtn.focus();
  };
  const close = () => { dialog.close(); lastTrigger?.focus(); };

  document.querySelectorAll<HTMLElement>('[data-zoomable]').forEach((wrap) => {
    const i = wrap.querySelector('img'); if (!i) return;
    wrap.style.cursor = 'zoom-in';
    wrap.addEventListener('click', () => open(i.src, i.alt, wrap));
  });
  closeBtn.addEventListener('click', close);
  dialog.addEventListener('click', (e) => { if (e.target === dialog) close(); });
  dialog.addEventListener('cancel', () => lastTrigger?.focus()); // Esc fires native cancel
}
```
Add `.lightbox`, `.lightbox-close`, `.lightbox-fig`, `.lightbox-hint`, `dialog.lightbox::backdrop` styles to `global.css`, tokenized (`--ink-on-dark`, backdrop `rgba(20,14,8,0.94)`).

- [ ] **Step 2: Write fixme E2E** (un-fixme in 5.5):
```ts
import { test } from '@playwright/test';
test.fixme('lightbox opens, traps focus, closes on Esc', async () => {});
```
- [ ] **Step 3: Verify build.** Commit `feat: native <dialog> lightbox island`.

---

### Task 4.3: Mount islands + view transitions

**Files:**
- Create: `src/components/layout/CaseInteractions.astro` (mounts both islands with `client:load`)
- Modify: `src/layouts/BaseLayout.astro` (enable view transitions)

- [ ] **Step 1: Enable view transitions in BaseLayout**

Add to `<head>`: `import { ClientRouter } from 'astro:transitions';` and `<ClientRouter />`. This gives §8.6 case→case cross-fade; falls back gracefully.

- [ ] **Step 2: Create CaseInteractions.astro**

```astro
<script>
  import { init as initToc } from '../../islands/toc-scrollspy';
  import { init as initLightbox } from '../../islands/lightbox';
  const run = () => { initToc(); initLightbox(); };
  run();
  document.addEventListener('astro:page-load', run); // re-init after view transitions
</script>
```

- [ ] **Step 3: Verify build.** Commit `feat: mount interaction islands + view transitions`.

---

### Task 4.4: Loading states + image optimization helper

**Files:**
- Create: `src/components/showcase/ShowcaseImage.astro` (wraps Astro `<Image>` with the pulse placeholder)
- Modify: `global.css` (pulse keyframes)

- [ ] **Step 1: Add the pulse + placeholder CSS**

`.image-showcase img { background: var(--bg-secondary); }` plus `@keyframes ipulse { 0%,100%{opacity:1} 50%{opacity:.85} }` applied to `[data-loading] { animation: ipulse 1.6s ease-in-out infinite; }`. Reduced-motion already neutralizes it via the global block.

- [ ] **Step 2: Implement ShowcaseImage.astro**

Wrap Astro `<Image>` (`loading="lazy"`, `decoding="async"`, `widths={[320,640,1280,1920]}`, `formats={['avif','webp']}`) inside a `<div data-zoomable>` so it's both optimized (§8.6) and lightbox-enabled. Hero `Cover` uses `loading="eager"` and a `--case-cover` gradient as the never-blank fallback.

- [ ] **Step 3: Verify build.** Commit `feat: optimized ShowcaseImage with calm loading state`.

---

# Phase 5 — Case study template + Twilio (proof of concept)

### Task 5.1: Content collection schema

**Files:**
- Create: `src/content/config.ts`
- Test: `tests/unit/schema.test.ts`

- [ ] **Step 1: Write the failing schema test**

```ts
import { expect, test } from 'vitest';
import { caseSchema } from '../../src/content/config';

const SECTIONS = [{ id: 's01', num: '01', label: 'The problem' }];

test('requires title/deck/slug/year/role/cover/order/featured/sections', () => {
  expect(() => caseSchema.parse({})).toThrow();
});
test('accepts a minimal valid case', () => {
  const ok = caseSchema.parse({
    title: 'T', deck: 'D', slug: 't', year: 2024, role: 'Senior PD',
    cover: { gradient: 'linear-gradient(#000,#111)' },
    order: 1, featured: true, sections: SECTIONS,
  });
  expect(ok.title).toBe('T');
  expect(ok.archive).toBe(false); // defaults to false
});
test('optional fields pass through', () => {
  const ok = caseSchema.parse({
    title: 'T', deck: 'D', slug: 't', year: 2024, role: 'Senior PD',
    cover: { image: '/x.png' }, order: 1, featured: false, sections: SECTIONS,
    company: 'Twilio', span: '~3.5 months', status: 'shipped', archive: true,
    outcome: { metric: '+179%', context: 'impressions' },
  });
  expect(ok.outcome?.metric).toBe('+179%');
  expect(ok.archive).toBe(true);
});
test('cover requires gradient OR image', () => {
  expect(() => caseSchema.parse({
    title: 'T', deck: 'D', slug: 't', year: 2024, role: 'Senior PD',
    cover: {}, order: 1, featured: false, sections: SECTIONS,
  })).toThrow();
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement config.ts** (exports `caseSchema` standalone so it's unit-testable, then wires collections). Encode §11.1 required/optional split with zod (Astro re-exports it as `z`). Required: `title`, `deck`, `slug`, `year`, `role`, `cover`, `order`, `featured`, and `sections` (array of `{id, num, label}` driving the per-case TOC, §6.2). `cover` is a refined union requiring `gradient` OR `image` (the third test asserts an empty cover throws). `archive` is a boolean defaulting to `false` (drives `getArchive()` in Task 5.2, removing the order-threshold ambiguity). Optional: `company`, `team`, `span`, `outcome`, `class`, `collaborators`, `status`, `liveUrl`. Include a `writing` collection for the future in-house path (§6.4 future).

- [ ] **Step 4: Run — expect PASS.** **Step 5: build.** **Step 6: commit** `feat: case + writing content collection schema`.

---

### Task 5.2: Case study dynamic route

**Files:**
- Create: `src/pages/work/[slug].astro`
- Create: `src/lib/cases.ts` (query helpers)

- [ ] **Step 1: Implement cases.ts** — `getAllCases()` (sorted by `order`), `getFeatured()` (`featured && !archive`, first by order), `getSelected()` (`featured && !archive`, excluding the featured one — or `!archive` non-featured if you prefer; pick `featured` cases beyond the spotlight), `getArchive()` (`archive === true`), `getNext(slug)` (next non-archive case by order, wrapping). All via `getCollection('cases')`. (Unit-tested in Task 6 via the homepage; here just create.)

- [ ] **Step 2: Implement [slug].astro**

`getStaticPaths()` from the cases collection. Renders: `Nav` → `BackLink` → `Hero` (from frontmatter) → `BodyWrap` with the MDX `<Content />` in `.body` and `<Toc sections={...}>` in the `toc` slot → `NextCase` → `Footer` → `CaseInteractions`. Derive the TOC `sections` list from the MDX frontmatter `sections` array (each `{id, num, label}`), so the TOC matches whatever sections that case authored (§6.2 per-case variation). Set `--case-cover` on `<main>` from frontmatter.

- [ ] **Step 3: Verify build** — will succeed only after at least one case exists; expect a "no paths" build that still exits 0. Commit `feat: case study dynamic route + query helpers`.

---

### Task 5.3: Twilio MDX content

**Files:**
- Create: `src/content/cases/twilio.mdx`
- Reference (read-only): `src/works/TwilioOnboarding.tsx`, `docs/superpowers/specs/mockups/case-study-twilio.html`

- [ ] **Step 1: Author twilio.mdx from REAL source content only (§5.1 no-fabrication)**

Frontmatter from §11.1 with the confirmed values (§15): `span: "~3.5 months"`, `team: "Cross-functional team across Growth, Console, and Phone Number"`, `outcome.metric: "+179%"`. `sections` array lists the 7 IDs/nums/labels from §3.3. Body imports components and fills each section using content pulled verbatim from `TwilioOnboarding.tsx`:
- s01 problem: three pain points (Lack of visibility / Limited use cases / Technical complexity) + JTBD quote — all from the TSX.
- s02 Looking around: Plivo / Vonage / Google Cloud with the real strength/gap lines from the TSX competitive section.
- s03 7→2: the seven real ideas list (from `IDEAS_LIST` in the TSX); options 03 & 07 marked selected; critique rows (the two real critiques).
- s04 Validating: 10 participants (4 customers + 6 non-customers), 2 objectives — verbatim; three real finding quotes; three real recommendations.
- s05 phased: Phase 1 "Shipped", Phases 2 & 3 "Planned"; real audience/metric per phase from the TSX.
- s06 outcome: +179% with the real context line.
- s07 learned: the two real Key Learnings (RAPID, phased approach), reframed as "what I learned."

**Do not invent any number, date, or quote.** If a value isn't in the TSX or confirmed in §15, omit it.

- [ ] **Step 2: Place Twilio images** — copy the referenced assets from `public/twilio/` to `public/cases/twilio/` (jtbd, flows, design_critique1/2, phase_1/2/3, hello_global). Reference them via `ShowcaseImage`/`Figure`.

- [ ] **Step 3: Verify build** — `/work/twilio/index.html` is generated. Commit `feat: Twilio case study content (real source only)`.

---

### Task 5.4: Twilio visual + interaction verification

**Files:**
- Modify: `tests/e2e/scrollspy.spec.ts`, `tests/e2e/lightbox.spec.ts` (un-fixme)
- Create: `tests/e2e/twilio.spec.ts`

- [ ] **Step 1: Un-fixme the scrollspy E2E and make it real**
```ts
import { test, expect } from '@playwright/test';
test('TOC active follows scroll and click jumps', async ({ page }) => {
  await page.goto('/work/twilio');
  const items = page.locator('.toc-item');
  await items.nth(4).click();
  await expect(items.nth(4)).toHaveAttribute('aria-current', 'location');
});
```

- [ ] **Step 2: Un-fixme the lightbox E2E**
```ts
import { test, expect } from '@playwright/test';
test('lightbox opens on showcase image and closes on Esc', async ({ page }) => {
  await page.goto('/work/twilio');
  await page.locator('[data-zoomable] img').first().click();
  const dialog = page.locator('dialog.lightbox');
  await expect(dialog).toBeVisible();
  await expect(page.locator('.lightbox-close')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});
```

- [ ] **Step 3: Add an axe pass for the case page**
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('twilio case has no axe violations', async ({ page }) => {
  await page.goto('/work/twilio');
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
```

- [ ] **Step 4: Run** `npm run build && npm run test:e2e`. Fix any violations (likely: heading order, missing alt text, contrast on overlay). Expected: all pass on both desktop + mobile projects.

- [ ] **Step 5: Commit** `test: Twilio case E2E (scrollspy, lightbox, axe)`.

---

# Phase 6 — Homepage

### Task 6.1: Home components (Featured, SelectedGrid, CaseCard, Archive)

**Files:** Create `src/components/home/{Featured,SelectedGrid,CaseCard,Archive}.astro`; Test `tests/unit/home.test.ts`

- [ ] **Step 1: Failing tests** — `CaseCard` renders cover + mono meta + `<h3>` title + summary; `SelectedGrid` lays out N cards in the asymmetric grid; `Archive` renders a clickable pill list with hover affordance markup.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port `.featured`, `.selected-grid`, `.case`/`.case-card`, `.archive` from `homepage.html`, tokenized. `Featured` takes the featured case entry; `SelectedGrid` takes the selected entries; `Archive` takes archive entries (link to `/work/<slug>`). **Step 4–6.** Commit `feat: homepage components`.

---

### Task 6.2: WritingList + Medium RSS (build-time)

**Files:**
- Create: `src/lib/medium.ts`, `src/components/home/WritingList.astro`
- Test: `tests/unit/medium.test.ts`

- [ ] **Step 1: Write the failing RSS-parse test** (no network — feed a fixture string)

```ts
import { expect, test } from 'vitest';
import { parseMediumFeed } from '../../src/lib/medium';

const FIXTURE = `<rss><channel>
  <item><title><![CDATA[Usability in-house]]></title>
    <pubDate>Mon, 01 Jan 2018 00:00:00 GMT</pubDate>
    <link>https://medium.com/p/abc</link>
    <content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/"><![CDATA[<img src="https://miro.medium.com/x.png"/><p>Testing Tasktop Hub's UX is complex.</p>]]></content:encoded>
  </item>
</channel></rss>`;

test('parseMediumFeed extracts title, date, link, excerpt, image', () => {
  const posts = parseMediumFeed(FIXTURE, 3);
  expect(posts).toHaveLength(1);
  expect(posts[0].title).toBe('Usability in-house');
  expect(posts[0].link).toBe('https://medium.com/p/abc');
  expect(posts[0].image).toBe('https://miro.medium.com/x.png');
  expect(posts[0].excerpt.length).toBeLessThanOrEqual(160);
  expect(posts[0].excerpt).toContain('Testing Tasktop Hub');
});

test('parseMediumFeed tolerates a missing image', () => {
  const noImg = FIXTURE.replace(/<img[^>]*\/>/, '');
  expect(parseMediumFeed(noImg, 3)[0].image).toBeNull();
});
```

- [ ] **Step 2: Run — expect FAIL.**

- [ ] **Step 3: Implement medium.ts**

Export `parseMediumFeed(xml: string, limit: number): MediumPost[]` (pure, using `fast-xml-parser`) and `fetchMedium(handle: string, limit = 3)` that `fetch`es `https://medium.com/feed/@${handle}` and calls the parser, wrapped in try/catch returning `[]` on failure (§6.4 graceful fallback). Strip HTML for the excerpt; first `<img src>` for the thumbnail; truncate excerpt to 160 chars at a word boundary.

- [ ] **Step 4: Run — expect PASS.**

- [ ] **Step 5: Implement WritingList.astro** — calls `fetchMedium('wangzhen614', 3)` at build time, renders mono date / display headline / sans excerpt / optional thumbnail (cream placeholder when null). Each row links out (`target="_blank" rel="noopener"`).

- [ ] **Step 6: Verify build** (tolerate network failure → empty list, page still builds). Commit `feat: Medium RSS writing previews (build-time, graceful fallback)`.

---

### Task 6.3: Assemble the homepage

**Files:**
- Modify: `src/pages/index.astro`
- Create: `tests/e2e/home.spec.ts`

- [ ] **Step 1: Build index.astro** — `Nav` → hero (eyebrow + F2 copy from §2, `<h1>`, sub with companies + hobbies) → `Featured` (from `getFeatured()`) → `SelectedGrid` (from `getSelected()`) → `WritingList` → `Archive` (from `getArchive()`) → `Footer`. Reading column capped at ~720px for the hero.

- [ ] **Step 2: E2E + axe**
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('home shows featured + selected + writing + archive, no axe issues', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.featured')).toBeVisible();
  await expect(page.locator('.selected-grid .case-card')).not.toHaveCount(0);
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
```

- [ ] **Step 3: Run** `npm run build && npm run test:e2e`. Fix violations. **Step 4: Commit** `feat: homepage assembled`.

---

# Phase 7 — About / Curriculum vitae

### Task 7.1: About components

**Files:** Create `src/components/about/{CvCallout,WorkHistory,EducationPractice,ReachMe}.astro`; Test `tests/unit/about.test.ts`

- [ ] **Step 1: Failing tests** — `CvCallout` has Download-PDF + View-in-browser buttons + "Last updated" line; `WorkHistory` renders chronological rows; `ReachMe` renders three contact cards.
- [ ] **Step 2: FAIL → Step 3: Implement.** Port the relevant blocks from `about-resume.html`, tokenized. `CvCallout` links to `/Zhen-Wang-Resume.pdf` (download) + opens it in a new tab (view); "Last updated" date is a prop. Use real work history from `src/about.tsx` + existing résumé (Twilio, Tasktop, Rackspace, plus education MHCI/UT Austin). **Step 4–6.** Commit `feat: about page components`.

---

### Task 7.2: Assemble /about + seal fallback

**Files:**
- Create: `src/pages/about.astro`, `src/components/about/Seal.astro`
- Create: `tests/e2e/about.spec.ts`

- [ ] **Step 1: Seal.astro with fallback (§15.4)** — if `public/seal.svg` exists, render it; otherwise render a styled "Z" wordmark in `var(--accent)`. Since Astro can't stat files at component runtime cleanly, use a try/import or check via `import.meta.glob('/public/seal.svg', { eager: true })`; simplest: attempt `<img src="/seal.svg" onerror=...>` is non-ideal — instead, gate on an `Astro.glob`/`import.meta.glob` result computed in the page and pass `hasSeal` as a prop.

```astro
---
interface Props { hasSeal: boolean; }
const { hasSeal } = Astro.props;
---
{hasSeal ? <img class="seal" src="/seal.svg" alt="Zhen Wang seal" width="96" height="96" />
         : <span class="seal seal--fallback" aria-label="Zhen Wang">Z</span>}
<style>
  .seal--fallback { font-family: var(--font-display); color: var(--accent); font-size: 64px; }
</style>
```
In `about.astro`: `const hasSeal = Object.keys(import.meta.glob('/public/seal.svg')).length > 0;`

- [ ] **Step 2: Assemble about.astro** — `Nav` → hero (eyebrow "About · Curriculum vitae", `Seal`, bio paragraph from §6.3) → `CvCallout` → `WorkHistory` → `EducationPractice` → `ReachMe` → `Footer`.

- [ ] **Step 3: E2E + axe**
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('about page: résumé download present, no axe issues', async ({ page }) => {
  await page.goto('/about');
  await expect(page.getByRole('link', { name: /download/i })).toHaveAttribute('href', /Resume\.pdf/);
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
```

- [ ] **Step 4: Run, fix, Commit** `feat: about/CV page with seal fallback`.

---

### Task 7.3: /writing index page

**Files:**
- Create: `src/pages/writing/index.astro`
- Create: `tests/e2e/writing.spec.ts`

The Nav (Task 2.1) links to `/writing`; this page must exist so the link resolves. For v1 it is a Medium-backed index reusing the `WritingList` component (Task 6.2) at full length rather than the 3-item homepage teaser.

- [ ] **Step 1: Implement writing/index.astro** — `Nav` → a hero (`<h1>Writing</h1>` + one-line deck) → `WritingList` rendering all fetched Medium posts (pass a higher `limit`, e.g. `fetchMedium('wangzhen614', 20)`) → `Footer`. If the feed is unreachable at build time, render a calm empty state ("Find my writing on Medium →" linking to the profile) rather than a blank section (§6.4 graceful fallback).

- [ ] **Step 2: E2E + axe**
```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('writing index resolves and has no axe issues', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.locator('h1')).toContainText('Writing');
  const r = await new AxeBuilder({ page }).analyze();
  expect(r.violations).toEqual([]);
});
```

- [ ] **Step 3: Run, fix, Commit** `feat: /writing index (Medium-backed, graceful empty state)`.

---

# Phase 8 — Migrate remaining cases + archive

> Each case is content-only (the component kit already exists). This phase also validates acceptance criterion "new case scaffolds in < 1 hour."

### Task 8.1: Tasktop Hub

**Files:** Create `src/content/cases/tasktop-hub.mdx`; copy assets to `public/cases/tasktop-hub/`

- [ ] **Step 1: Author from `src/works/TasktopHub.tsx` real content only.** Frontmatter: company Tasktop, year 2022, role Lead Designer, own `--case-cover` (blue gradient from mockup), `order: 2`, `featured: true` (so it appears in the homepage Selected lineup — per §11.1, `featured` means "on the homepage in the Featured slot or Selected lineup"; the single spotlight is the lowest-order featured case, i.e. Twilio at order 1). Author the sections the Hub story actually needs (may be fewer than 7 — §6.2). No fabricated metrics; use only what's in the TSX.
- [ ] **Step 2: Verify build** — `/work/tasktop-hub` generated; appears in homepage Selected.
- [ ] **Step 3: Commit** `feat: Tasktop Hub case`.

### Task 8.2: Tasktop Viz — same pattern from `TasktopViz.tsx`. Commit `feat: Tasktop Viz case`.

### Task 8.3: Rackspace ServiceNow — same pattern from `Rackspace.tsx`. Commit `feat: Rackspace case`.

### Task 8.4: Park Engagement — same pattern from `ParkEngagement.tsx` (research-led; journey-map figure). Commit `feat: Park Engagement case`.

### Task 8.5: Archive cases (lighter)

**Files:** Create `src/content/cases/{ilab,citportal,pool-my-ride,techscene,plotguru}.mdx`

- [ ] **Step 1: Author minimal archive entries** — frontmatter with `featured: false` and `archive: true` (the boolean added to `caseSchema` in Task 5.1). Each archive case is a short single-section page (title, deck, a few figures, one `sections` entry) sourced from the existing TSX. Academic ones use the `class:` meta field (§11.1).
- [ ] **Step 2: Verify build** — all archive routes generate; homepage Archive pill list links to them.
- [ ] **Step 3: Commit** `feat: archive cases`.

---

# Phase 9 — Responsive, a11y, performance polish

### Task 9.1: Implement the breakpoint matrix (§9, §12.6)

**Files:** Modify component `<style>` blocks + add `src/styles/responsive.css` if shared rules emerge

- [ ] **Step 1: Add `@media` rules for all four ranges** per §9.1 — 1280 (sidebar TOC), 1024–1279 (thin TOC column), 768–1023 (TOC hidden + top progress bar), <768 (progress bar + drawer, hamburger nav, single-col meta strip, card row stacks, phase number 48px, reflection stacks). Tokenize spacing overrides (`--pad-page-x`, `--pad-section-y` shrink per breakpoint at `:root` media queries).
- [ ] **Step 2: Implement the top progress bar + mobile TOC drawer** (tablet/mobile TOC behavior) as part of the scrollspy island — a thin accent bar reflecting scroll %, section tag updating from the same active-section logic.
- [ ] **Step 3: Playwright responsive assertions**
```ts
import { test, expect } from '@playwright/test';
test('TOC sidebar hidden below 1024, progress bar shown', async ({ page }) => {
  await page.setViewportSize({ width: 800, height: 900 });
  await page.goto('/work/twilio');
  await expect(page.locator('.toc')).toBeHidden();
  await expect(page.locator('.progress-bar')).toBeVisible();
});
```
- [ ] **Step 4: Run, fix, Commit** `feat: responsive breakpoints + mobile TOC`.

### Task 9.2: Keyboard nav E2E across pages

- [ ] **Step 1: Write a Playwright test** tabbing through home + case, asserting the skip link works, TOC buttons are reachable, lightbox traps focus, focus returns to trigger on close.
- [ ] **Step 2: Run, fix any focus-order issues, Commit** `test: keyboard navigation across pages`.

### Task 9.3: Lighthouse budgets

- [ ] **Step 1: Run** `npm run build && npx lhci autorun` against `/index.html`, `/work/twilio/index.html`, `/about/index.html` (add all three URLs to `lighthouserc.cjs`).
- [ ] **Step 2: Fix** until a11y ≥ 0.95 (error gate) and perf ≥ 0.90 mobile (warn). Common fixes: explicit image dimensions, font-display swap, preconnect for Google Fonts if used.
- [ ] **Step 3: Commit** `test: Lighthouse budgets (a11y ≥ 95, perf ≥ 90)`.

---

# Phase 10 — Cleanup, token audit, ship

### Task 10.1: Token-rule grep gate (§12.3)

**Files:** Create `tests/unit/no-hardcoded-values.test.ts`

- [ ] **Step 1: Write a test** that reads every `src/components/**/*.astro` `<style>` block and fails if it finds a hex color (`#[0-9a-fA-F]{3,8}`) or a raw `px` value outside a `var(...)` / `clamp(...)` / `calc(...)` / media-query condition. Allow a small documented allowlist (e.g. `0`, `1px` hairlines, `100%`, `50vw` full-bleed trick, `aspect-ratio` numbers).
```ts
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { expect, test } from 'vitest';
// use a glob lib or fast-glob; assert no bare #hex in component <style> blocks
```
- [ ] **Step 2: Run — fix any leaked literals** by extracting tokens (e.g. the highlight amber, any stray shadow). **Step 3: Commit** `test: enforce token-only values in component CSS`.

### Task 10.2: Retire webpack/React source

**Files:** Delete `src/works/`, `src/components/` (old TSX), `src/*.tsx`, `@types/`, `tsconfig` leftovers, MUI/Emotion/React deps already removed in 0.1

- [ ] **Step 1: Confirm nothing in the new `src/` imports the old TSX** — `grep -r "works/" src/pages src/components src/layouts || echo clean`.
- [ ] **Step 2: Delete the old source dirs/files.** Keep `public/` assets still referenced; remove orphaned ones only if confirmed unused.
- [ ] **Step 3: Verify build + full test suite** — `npm run build && npm test && npm run test:e2e`.
- [ ] **Step 4: Commit** `chore: remove legacy webpack/React source`.

### Task 10.3: SEO, sitemap, favicon, robots, redirects

- [ ] **Step 1: Per-page `<title>`/`<meta description>`/OpenGraph** via BaseLayout props; verify `@astrojs/sitemap` emits `sitemap-index.xml`. Keep `public/robots.txt`, `favicon.ico`, `manifest.json`. Point favicon at `seal.svg` when present.
- [ ] **Step 2: Verify** `dist/sitemap-index.xml` exists after build. **Step 3: Commit** `feat: SEO meta + sitemap + favicon`.

### Task 10.4: Final verification + PR

- [ ] **Step 1: Full gate** — `npm run build && npm test && npm run test:e2e && npx lhci autorun`. All green.
- [ ] **Step 2: Local preview smoke** — `npm run preview`, click through `/`, `/work/twilio`, every other case, `/about`, `/writing`; confirm UTF-8 renders, TOC/lightbox/marker work, mobile layout holds.
- [ ] **Step 3: Push and open PR**
```bash
git push -u origin feat/portfolio-revamp
gh pr create --base main --title "Portfolio revamp: Astro + MDX, Warm Editorial Pro" \
  --body "Implements docs/superpowers/specs/2026-05-04-portfolio-revamp-design.md. See plan docs/superpowers/plans/2026-05-04-portfolio-revamp.md."
```
- [ ] **Step 4: Confirm the Actions run is green on the PR** (build + unit tests). Merging deploys to `wangzhenux.github.io` via the existing workflow.

---

## Acceptance criteria mapping (§16)

| Criterion | Satisfied by |
|---|---|
| Plan covers every §7 component | Phase 2 (chrome/layout) + Phase 3 (all data/showcase) + Phase 4 (TOC/lightbox behavior) |
| Respects every §12 requirement | 1→Task 4.2 · 2→Task 1.1 · 3→Task 10.1 · 4→Tasks 3.x modifiers · 5→Task 1.1 · 6→Task 9.1 · 7→Task 4.1 · 8→Task 4.1 · 9→Task 3.2/5.3 · 10→Tasks 3.1/3.5 · 11→Task 4.4 |
| Twilio renders at all four breakpoints | Task 5.3 + Task 9.1 |
| New case scaffolds < 1 hour | Phase 8 (content-only MDX, kit already built) |
| Lighthouse a11y ≥ 95, perf ≥ 90 | Task 9.3 |
| Deploys via existing workflow | Task 0.4 + Task 10.4 |
| Zhen signs off | PR review in Task 10.4 |
