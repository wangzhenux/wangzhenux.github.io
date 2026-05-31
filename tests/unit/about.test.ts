import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import CvCallout from '../../src/components/about/CvCallout.astro';
import WorkHistory from '../../src/components/about/WorkHistory.astro';
import ReachMe from '../../src/components/about/ReachMe.astro';

test('CvCallout has download + view-in-browser buttons and a Last updated line', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(CvCallout, { props: { lastUpdated: 'April 2026' } });

  // Download button: links to the résumé PDF with a download attribute.
  expect(html).toMatch(/<a[^>]*href="\/Zhen-Wang-Resume\.pdf"[^>]*download/);
  expect(html.toLowerCase()).toContain('download');

  // View-in-browser button: same PDF, opens in a new tab.
  expect(html).toMatch(/<a[^>]*href="\/Zhen-Wang-Resume\.pdf"[^>]*target="_blank"/);
  expect(html.toLowerCase()).toContain('view in browser');

  // Last updated subline reflects the prop.
  expect(html).toContain('Last updated');
  expect(html).toContain('April 2026');
});

test('WorkHistory renders one row per role with role + company', async () => {
  const c = await AstroContainer.create();
  const roles = [
    { role: 'Senior Product Designer', company: 'Twilio' },
    { role: 'Lead UX Designer', company: 'Tasktop' },
    { role: 'Senior Designer', company: 'Rackspace' },
  ];
  const html = await c.renderToString(WorkHistory, { props: { roles } });
  expect((html.match(/class="history-row"/g) || []).length).toBe(3);
  expect(html).toContain('Senior Product Designer');
  expect(html).toContain('Twilio');
  expect(html).toContain('Tasktop');
  expect(html).toContain('Rackspace');
});

test('WorkHistory omits the year/location columns when values are absent', async () => {
  const c = await AstroContainer.create();
  const roles = [{ role: 'Senior Designer', company: 'Rackspace' }];
  const html = await c.renderToString(WorkHistory, { props: { roles } });
  // No fabricated year or location text leaks in.
  expect(html).not.toContain('history-year');
  expect(html).not.toContain('history-loc');
});

test('ReachMe renders three contact cards with the real links', async () => {
  const c = await AstroContainer.create();
  const html = await c.renderToString(ReachMe);
  expect((html.match(/class="reach-card"/g) || []).length).toBe(3);
  expect(html).toContain('mailto:wangzhen614@gmail.com');
  expect(html).toContain('https://www.linkedin.com/in/zhenwang614');
  expect(html).toContain('https://www.instagram.com/zhen.wang/');
});
