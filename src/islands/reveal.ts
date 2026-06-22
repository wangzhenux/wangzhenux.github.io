/**
 * Reveal-on-scroll island (flagship case scrollytelling).
 *
 * Opt-in and degradation-safe: `[data-reveal]` elements are fully visible by
 * default. Only when this island runs — and motion is allowed — does it add
 * `reveal-enabled` to <html>, which arms the hidden→shown transition defined in
 * global.css. So if JS fails or the user prefers reduced motion, nothing is ever
 * hidden. A one-shot IntersectionObserver adds `is-visible` as each element
 * scrolls into view. No-ops on pages without `[data-reveal]` (every other case).
 */
export function init(): void {
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
  if (targets.length === 0) return;

  const reduced =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced || !('IntersectionObserver' in window)) return; // leave everything visible

  document.documentElement.classList.add('reveal-enabled');

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target); // reveal once, then stop watching
        }
      }
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );

  // Anything already in (or above) the viewport on load shows immediately so the
  // first screen never starts blank; the rest animate in on scroll.
  for (const el of targets) {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('is-visible');
    } else {
      io.observe(el);
    }
  }
}
