import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import BodyWrap from '../../src/components/layout/BodyWrap.astro';

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
