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
  lead: 'How a US-only developer platform learned to feel global.',
};

test('CaseCard renders header (company fallback) + title + lead + gradient cover fallback', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CaseCard, { props: sampleCase });
  // whole card is one link to the case
  expect(html).toMatch(/class="ccard"[^>]*href="\/work\/twilio"/);
  // header: no logo given -> company name fallback
  expect(html).toMatch(/class="ccard-co"[^>]*>Twilio/);
  // title + lead (from `lead` prop)
  expect(html).toMatch(/class="ccard-title"/);
  expect(html).toContain("Onboarding Twilio&#39;s first international tier");
  expect(html).toMatch(/class="ccard-lead"/);
  expect(html).toContain('learned to feel global');
  // no shot -> gradient cover fallback fills the shot area
  expect(html).toMatch(/class="ccard-cover"/);
});

test('CaseCard renders logo, tag pills, brand flood var, and framed shot when given', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CaseCard, {
    props: {
      ...sampleCase,
      lead: 'Teaching a US-only platform to feel global.',
      tags: ['UX design', 'Onboarding'],
      brand: '#7E1D2B',
      logo: '/logos/twilio.svg',
      logoAlt: 'Twilio',
      shot: '/cases/twilio/onboarding_cover.png',
      frame: 'browser',
    },
  });
  expect(html).toMatch(/class="ccard-logo"[^>]*src="\/logos\/twilio\.svg"/);
  expect((html.match(/class="pill"/g) || []).length).toBe(2);
  expect(html).toContain('--card-brand: #7E1D2B');
  expect(html).toMatch(/pframe--browser/);
  expect(html).toMatch(/<img[^>]+src="\/cases\/twilio\/onboarding_cover\.png"/);
});

test('CaseCard falls back to the illustration cover image when there is no shot', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CaseCard, {
    props: { ...sampleCase, cover: undefined, coverImage: '/cases/twilio/cover.png' },
  });
  expect(html).toMatch(/class="ccard-cover-img"[^>]*src="\/cases\/twilio\/cover\.png"/);
});

test('SelectedGrid lays out N equal-width case cards', async () => {
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
