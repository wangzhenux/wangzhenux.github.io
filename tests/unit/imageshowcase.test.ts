import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import ImageShowcase from '../../src/components/showcase/ImageShowcase.astro';

test('ImageShowcase wraps slot in a full-bleed band', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ImageShowcase, { slots: { default: '<img src="/x.png" alt="x" />' } });
  expect(html).toContain('class="image-showcase"');
  expect(html).toContain('/x.png');
});

test('ImageShowcase marks the image wrapper as zoomable for the lightbox', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ImageShowcase, { slots: { default: '<img src="/x.png" alt="x" />' } });
  expect(html).toContain('data-zoomable');
});
