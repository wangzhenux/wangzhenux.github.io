/**
 * TOC scrollspy + click-to-scroll island (§8.2 / §8.3).
 *
 * `pickActive` is a pure function (no DOM) so the section-selection decision is
 * unit-testable. `init()` wires it to the live document.
 */

export interface Ratio {
  id: string;
  ratio: number;
}

/** Returns the id with the highest intersection ratio, or null if all are zero. */
export function pickActive(ratios: Ratio[]): string | null {
  let best: string | null = null;
  let bestR = 0;
  for (const { id, ratio } of ratios) {
    if (ratio > bestR) {
      bestR = ratio;
      best = id;
    }
  }
  return best;
}

export function init(): void {
  const toc = document.querySelector<HTMLElement>('.toc');
  const items = Array.from(document.querySelectorAll<HTMLButtonElement>('.toc-item'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.body section[id]'));
  if (!toc || !items.length || !sections.length) return;

  // Guard against double-mount. CaseInteractions calls run() synchronously AND on
  // `astro:page-load` (which also fires on the initial load), so init() would
  // otherwise wire two sets of listeners + observers to the same DOM — and the
  // second init()'s re-seed could clobber the active item just set by a click.
  if (toc.dataset.spy === 'on') return;
  toc.dataset.spy = 'on';

  // aria-live region announcing the active section label (§12.8).
  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.className = 'visually-hidden';
  document.body.appendChild(live);

  const byId = new Map(items.map((b) => [b.dataset.target!, b]));
  const ratios = new Map(sections.map((s) => [s.id, 0]));
  let tocHidden = false;
  // When the user clicks a TOC item we pin that section as active and ignore the
  // spy until they scroll manually again. Without this the smooth click-scroll
  // sweeps the spy through intervening sections (and a full-bleed showcase can
  // freeze the TOC mid-sweep), clobbering the section the user actually chose.
  let pinnedId: string | null = null;

  const setActive = (id: string | null) => {
    if (!id) return;
    items.forEach((b) => {
      b.classList.remove('active');
      b.removeAttribute('aria-current');
    });
    const el = byId.get(id);
    if (el) {
      el.classList.add('active');
      el.setAttribute('aria-current', 'location');
      live.textContent = el.textContent;
    }
  };

  const refresh = () => {
    if (pinnedId || tocHidden) return;
    setActive(pickActive(Array.from(ratios, ([id, ratio]) => ({ id, ratio }))));
  };

  // ONE IntersectionObserver instance, observing every section exactly once.
  const spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) ratios.set((e.target as HTMLElement).id, e.intersectionRatio);
      refresh();
    },
    { rootMargin: '-25% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
  );
  sections.forEach((s) => spy.observe(s));

  // Showcase fade: hide the TOC (and pause setActive) while a full-bleed showcase
  // band is on screen (§8.3).
  const showcases = document.querySelectorAll('.image-showcase');
  if (showcases.length) {
    const visible = new Set<Element>();
    const showcaseObserver = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        tocHidden = visible.size > 0;
        toc.classList.toggle('hidden', tocHidden);
        if (!tocHidden) refresh();
      },
      { rootMargin: '-15% 0px -15% 0px' }
    );
    showcases.forEach((s) => showcaseObserver.observe(s));
  }

  // Click-to-scroll: pin the chosen section active, then smooth-scroll to it. The
  // pin holds the active state through the entire programmatic scroll and is only
  // released by a genuine user-initiated scroll (wheel / touch / keyboard), so the
  // spy can never override the section the user just navigated to.
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const unpin = () => {
    if (!pinnedId) return;
    pinnedId = null;
    refresh();
  };
  // Real user scroll intent → drop the pin. Programmatic scrollIntoView does not
  // fire these, so the pin survives the click-scroll.
  ['wheel', 'touchstart', 'keydown'].forEach((evt) =>
    window.addEventListener(evt, unpin, { passive: true })
  );
  items.forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.target!;
      const target = document.getElementById(id);
      if (!target) return;
      pinnedId = id;
      setActive(id);
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    })
  );

  // Seed the initial active item by nearest-section-to-top (do not rely on a
  // hardcoded `.active`, §12.7).
  const seed = sections.reduce(
    (best, s) =>
      Math.abs(s.getBoundingClientRect().top) < Math.abs(best.getBoundingClientRect().top)
        ? s
        : best,
    sections[0]
  );
  setActive(seed.id);
}
