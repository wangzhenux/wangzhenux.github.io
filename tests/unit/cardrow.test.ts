import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import PainCard from '../../src/components/data/PainCard.astro';

test('PainCard has num, h3 title, body', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(PainCard, {
    props: { num: '01', title: 'Lack of visibility' },
    slots: { default: 'Customers did not know the regions existed.' },
  });
  expect(html).toContain('class="pain-card"');
  expect(html).toContain('01');
  expect(html).toMatch(/<h3[^>]*>Lack of visibility/);
});
