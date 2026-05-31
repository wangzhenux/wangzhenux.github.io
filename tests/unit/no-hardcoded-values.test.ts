import { readFileSync, globSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

/**
 * §12.3 token-only gate.
 *
 * Reads every `<style>` block in our `.astro` components/layouts and fails if a
 * value should have been a design token but was hardcoded instead. The gate is
 * deliberately pragmatic: it targets the two classes of mistake that actually
 * erode the token system — hardcoded COLORS and hardcoded LAYOUT SPACING — while
 * tolerating legitimate type/size literals (font-size, line-height, width,
 * height, aspect-ratio, border-radius) that don't belong to the spacing scale.
 *
 * COLOR rule — fail on any of:
 *   - hex color literal       (#abc, #aabbcc, #aabbccdd)
 *   - rgb()/rgba()/hsl()/hsla() literal
 * Colors must always read a token (--ink-*, --accent*, --rule*, --cover-*, …).
 *
 * SPACING rule — fail on a raw `px` value in a layout property:
 *   padding / margin / gap / top / left / right / bottom  (and -* variants,
 *   plus row-gap/column-gap, inset, inset-block/inline, *-inline/-block).
 * Allowlist (NOT a violation):
 *   - `0`                          (zero needs no unit/token)
 *   - `1px`, `2px`                 (hairline / optical nudges)
 *   - values wrapped in var() / calc() / clamp() / min() / max()
 *   - non-px units: %, vw, vh, vmin, vmax, fr, ch, em, rem, ex
 *   - @media query conditions      (min-width/max-width breakpoints)
 *
 * Type/size literals are intentionally NOT gated (font-size, line-height,
 * width, height, aspect-ratio, border-radius — radius now also has tokens
 * --radius-sm/--radius and has been swept, but small leaf radii like the 2px
 * progress-track hairline remain tolerable).
 */

const files = globSync([
  'src/components/**/*.astro',
  'src/layouts/**/*.astro',
]).sort();

/** Pull the body of every <style>…</style> block out of an .astro file. */
function styleBlocks(source: string): string {
  const blocks: string[] = [];
  const re = /<style[^>]*>([\s\S]*?)<\/style>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(source))) blocks.push(m[1]);
  return blocks.join('\n');
}

/** Strip /* … *​/ comments so commented-out hexes/notes never trip the gate. */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, '');
}

const SPACING_PROP =
  /(?:padding|margin|gap|row-gap|column-gap|inset|top|left|right|bottom)(?:-[a-z]+)*/;

// `<property>: <value>` where the property is a spacing property. Anchored at a
// declaration boundary ({, }, ; or start) so selectors/at-rules don't match.
const SPACING_DECL = new RegExp(
  `(?:^|[{};])\\s*(${SPACING_PROP.source})\\s*:\\s*([^;{}]+)`,
  'gi',
);

// A single `<number>px` token that is NOT 0/1px/2px.
const RAW_PX = /\b(\d+(?:\.\d+)?)px\b/g;

function spacingViolations(css: string): string[] {
  const out: string[] = [];
  // Strip @media query CONDITIONS (breakpoint px is legitimate) before scanning
  // declarations — the conditions live between `@media` and the opening `{`.
  const scannable = css.replace(/@media[^{]*\{/gi, '{');

  let decl: RegExpExecArray | null;
  SPACING_DECL.lastIndex = 0;
  while ((decl = SPACING_DECL.exec(scannable))) {
    const prop = decl[1];
    const value = decl[2];
    // Allow values composed of var()/calc()/clamp()/min()/max() — strip those
    // wrappers (and their contents) before scanning for raw px.
    const wrapped = value.replace(/(?:var|calc|clamp|min|max)\([^)]*\)/g, '');

    let m: RegExpExecArray | null;
    RAW_PX.lastIndex = 0;
    while ((m = RAW_PX.exec(wrapped))) {
      const n = parseFloat(m[1]);
      if (n === 0 || n === 1 || n === 2) continue; // hairline/optical allowlist
      out.push(`${prop}: ${value.trim()}  →  raw ${m[0]} (use a --space-* token)`);
    }
  }
  return out;
}

const HEX = /#[0-9a-fA-F]{3,8}\b/g;
const FUNC_COLOR = /\b(?:rgba?|hsla?)\s*\(/gi;

function colorViolations(css: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  HEX.lastIndex = 0;
  while ((m = HEX.exec(css))) out.push(`hardcoded hex color ${m[0]} (use a color token)`);
  FUNC_COLOR.lastIndex = 0;
  while ((m = FUNC_COLOR.exec(css))) out.push(`hardcoded ${m[0]}…) color (use a color token)`);
  return out;
}

test('the gate found component/layout style blocks to scan', () => {
  expect(files.length).toBeGreaterThan(10);
});

describe('component CSS is token-only (§12.3)', () => {
  test.each(files)('%s', (file) => {
    const css = stripComments(styleBlocks(readFileSync(file, 'utf8')));
    const violations = [...colorViolations(css), ...spacingViolations(css)];
    expect(violations, `${file}\n  ${violations.join('\n  ')}`).toEqual([]);
  });
});
