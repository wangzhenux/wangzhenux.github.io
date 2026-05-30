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
