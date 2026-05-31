import { expect, test } from 'vitest';
import { parseMediumFeed } from '../../src/lib/medium';

const FIXTURE = `<rss><channel>
  <item><title><![CDATA[Usability in-house]]></title>
    <pubDate>Mon, 01 Jan 2018 00:00:00 GMT</pubDate>
    <link>https://medium.com/p/abc</link>
    <content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/"><![CDATA[<img src="https://miro.medium.com/x.png"/><p>Testing Tasktop Hub's UX is complex.</p>]]></content:encoded>
  </item>
</channel></rss>`;

test('parseMediumFeed extracts title, date, link, excerpt, image', () => {
  const posts = parseMediumFeed(FIXTURE, 3);
  expect(posts).toHaveLength(1);
  expect(posts[0].title).toBe('Usability in-house');
  expect(posts[0].link).toBe('https://medium.com/p/abc');
  expect(posts[0].image).toBe('https://miro.medium.com/x.png');
  expect(posts[0].excerpt.length).toBeLessThanOrEqual(160);
  expect(posts[0].excerpt).toContain('Testing Tasktop Hub');
});

test('parseMediumFeed tolerates a missing image', () => {
  const noImg = FIXTURE.replace(/<img[^>]*\/>/, '');
  expect(parseMediumFeed(noImg, 3)[0].image).toBeNull();
});
