import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import QuoteCard from '../../src/components/data/QuoteCard.astro';

test('QuoteCard has mono label, h4 heading, and italic quote', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(QuoteCard, {
    props: { label: 'Finding 01', heading: 'Complex onboarding' },
    slots: { default: "I don't even know if someone needs to choose a default location." },
  });
  expect(html).toContain('class="quote-card"');
  expect(html).toContain('Finding 01');
  expect(html).toMatch(/<h4[^>]*>Complex onboarding/);
  expect(html).toContain('class="q"');
  expect(html).toContain("default location");
});
