import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import ShowcaseImage from '../../src/components/showcase/ShowcaseImage.astro';

test('ShowcaseImage (string src) renders a lazy, zoomable img with dimensions', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ShowcaseImage, {
    props: { src: '/cases/twilio/jtbd.png', alt: 'JTBD map', width: 1280, height: 720 },
  });
  expect(html).toContain('data-zoomable');
  expect(html).toContain('/cases/twilio/jtbd.png');
  expect(html).toContain('alt="JTBD map"');
  expect(html).toContain('loading="lazy"');
  expect(html).toContain('decoding="async"');
  expect(html).toContain('data-loading');
  expect(html).toMatch(/width="1280"/);
  expect(html).toMatch(/height="720"/);
});
