/**
 * In-view island for the storytelling components (StageFlow, ChatMock,
 * StoryBlocks, BrokeCarousel, ProcessStrip, LadderFigure, ThresholdCards,
 * AiRoleTable, CompareTable).
 *
 * Same contract as reveal.ts: every component is fully visible by default. Only
 * when this island runs AND motion is allowed does it add `inview-armed` to
 * <html>, which arms each component's hidden → shown choreography. `is-in` lands
 * on each `[data-inview]` element once its top passes ~80% of the viewport, then
 * the observer lets go. Reduced motion (or no IntersectionObserver) marks
 * everything in at once, so nothing waits on a scroll.
 */
export function init(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-inview]'));
  if (targets.length === 0) return;

  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) {
    for (const el of targets) el.classList.add('is-in');
    return;
  }

  document.documentElement.classList.add('inview-armed');

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          obs.unobserve(entry.target);
        }
      }
    },
    { rootMargin: '0px 0px -20% 0px', threshold: 0 }
  );

  for (const el of targets) {
    if (el.classList.contains('is-in')) continue;
    // Anything already above the fold plays at once so the first screen is never blank.
    if (el.getBoundingClientRect().top < window.innerHeight * 0.8) {
      el.classList.add('is-in');
    } else {
      io.observe(el);
    }
  }
}
