export interface Writing {
  title: string;
  link: string;
  excerpt: string;
  image: string;
}

/**
 * Curated writing — the canonical set from the original portfolio. Two of the
 * three are published under the @Tasktop publication rather than the personal
 * feed, so a single-handle Medium RSS pull only ever surfaces one of them; a
 * curated list is the reliable way to show all three. Excerpts are condensed
 * from each piece's own opening (no invented claims); hero images are
 * downscaled and served locally from /writing for resilience.
 */
export const writings: Writing[] = [
  {
    title: 'Optimizing UX: How to set up your own Usability Testing Program in-house',
    link: 'https://medium.com/@wangzhen614/optimizing-ux-how-to-set-up-your-own-usability-testing-program-in-house-8cd059e6911c',
    excerpt:
      "Testing Tasktop Integration Hub's user experience is a complex undertaking — the users who benefit most often have no idea it exists. So we built an in-house usability testing program.",
    image: '/writing/optimizing-ux.png',
  },
  {
    title: 'Why you should bring the UX Designer closer to the Product Development action',
    link: 'https://medium.com/@Tasktop/why-you-should-bring-the-ux-designer-closer-to-the-product-development-action-56a917f7e292',
    excerpt:
      'UX design is crucial to delivering software that delights end users, so the designer should be brought in as early as possible — here is how Tasktop changed its process to bring UX closer to the product team.',
    image: '/writing/ux-closer.png',
  },
  {
    title: 'A Day In The Life: of a solo UX Designer at a software company',
    link: 'https://medium.com/@Tasktop/a-day-in-the-life-of-a-solo-ux-designer-at-a-software-company-36e9b14cf945',
    excerpt:
      "Being the solo UX designer at a software company is a privilege — and not without its challenges. The main challenges I face, and the benefits I enjoy, in a typical working day.",
    image: '/writing/day-in-life.png',
  },
];
