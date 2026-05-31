import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import CaseCard from '../../src/components/home/CaseCard.astro';
import SelectedGrid from '../../src/components/home/SelectedGrid.astro';
import Archive from '../../src/components/home/Archive.astro';

const sampleCase = {
  slug: 'twilio',
  title: "Onboarding Twilio's first international tier",
  company: 'Twilio',
  year: 2024,
  role: 'Senior Product Designer',
  cover: 'linear-gradient(135deg, #F22F46, #6B1F2E)',
  summary: 'How a US-only developer platform learned to feel global.',
};

test('CaseCard renders cover + mono meta line + h3 title link + summary', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CaseCard, { props: sampleCase });
  // cover
  expect(html).toContain('case-cover');
  // mono meta line: company · year · role
  expect(html).toMatch(/class="case-meta"/);
  expect(html).toContain('Twilio');
  expect(html).toContain('2024');
  expect(html).toContain('Senior Product Designer');
  // h3 title links to /work/<slug>
  expect(html).toMatch(/<h3[^>]*class="case-title"/);
  expect(html).toContain("Onboarding Twilio's first international tier");
  expect(html).toContain('href="/work/twilio"');
  // summary
  expect(html).toMatch(/class="case-summary"/);
  expect(html).toContain('learned to feel global');
});

test('CaseCard renders an image cover when given an image', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CaseCard, {
    props: { ...sampleCase, cover: undefined, image: '/cases/twilio/cover.png' },
  });
  expect(html).toContain('case-cover');
  expect(html).toMatch(/<img[^>]+src="\/cases\/twilio\/cover\.png"/);
});

test('SelectedGrid lays out N case cards in the asymmetric grid', async () => {
  const c = await AstroContainer.create();
  const cases = [
    { ...sampleCase, slug: 'a', title: 'A' },
    { ...sampleCase, slug: 'b', title: 'B' },
    { ...sampleCase, slug: 'c', title: 'C' },
  ];
  const html = await c.renderToString(SelectedGrid, { props: { cases } });
  expect(html).toContain('selected-grid');
  expect((html.match(/class="[^"]*case-card/g) || []).length).toBe(3);
  expect(html).toContain('href="/work/a"');
  expect(html).toContain('href="/work/c"');
});

test('SelectedGrid renders nothing when there are no cases', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(SelectedGrid, { props: { cases: [] } });
  expect(html).not.toContain('selected-grid');
});

test('Archive renders a clickable pill per entry linking to /work/<slug>', async () => {
  const c = await AstroContainer.create();
  const items = [
    { slug: 'ilab', title: 'iLab', year: 2014 },
    { slug: 'citportal', title: 'CIT Portal', year: 2013 },
  ];
  const html = await c.renderToString(Archive, { props: { items } });
  expect(html).toContain('archive');
  expect((html.match(/class="archive-item"/g) || []).length).toBe(2);
  expect(html).toContain('href="/work/ilab"');
  expect(html).toContain('href="/work/citportal"');
  expect(html).toContain('iLab');
  // hover affordance arrow markup present
  expect(html).toContain('arrow');
});

test('Archive renders nothing when there are no entries', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(Archive, { props: { items: [] } });
  expect(html).not.toContain('class="archive-item"');
});
