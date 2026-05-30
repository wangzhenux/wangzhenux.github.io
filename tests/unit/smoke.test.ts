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
