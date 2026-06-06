import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import QuoteCard from '../../src/components/data/QuoteCard.astro';

test('QuoteCard has mono label, h4 heading, and the quote inside .q', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(QuoteCard, {
    props: {
      label: 'Finding 01',
      heading: 'Complex onboarding',
      quote: "I don't even know if someone needs to choose a default location.",
    },
  });
  expect(html).toContain('class="quote-card"');
  expect(html).toContain('Finding 01');
  expect(html).toMatch(/<h4[^>]*>Complex onboarding/);
  // The quote text must live INSIDE the styled .q paragraph (not spilled into a
  // stray body-font <p> by an illegal nested <p>). Assert it sits between the
  // opening <p class="q" ...> tag and its closing </p>.
  expect(html).toMatch(/<p class="q"[^>]*>[^<]*default location\.[^<]*<\/p>/);
});
