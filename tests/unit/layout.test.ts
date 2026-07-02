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

test('BodyWrap wraps the body in the content frame (no sidebar TOC)', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(BodyWrap, {
    slots: { default: '<p>body</p>' },
  });
  expect(html).toContain('<p>body</p>');
  expect(html).toContain('class="body-wrap"');
  // The sidebar TOC region was removed — the top progress bar is the section nav now.
  expect(html).not.toContain('body-toc');
});
