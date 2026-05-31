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
  // The sidebar TOC and the mobile progress-bar drawer share `.toc-item` buttons
  // (same data-target), so a single collection drives active-state + click-scroll
  // for both. The progress bar may exist without the sidebar at <1024px, so the
  // guard below keys off either.
  const items = Array.from(document.querySelectorAll<HTMLButtonElement>('.toc-item'));
  const sections = Array.from(document.querySelectorAll<HTMLElement>('.body section[id]'));
  const progressBar = document.querySelector<HTMLElement>('.progress-bar');
  const mountEl = toc ?? progressBar;
  if (!mountEl || !items.length || !sections.length) return;

  // Guard against double-mount. CaseInteractions calls run() synchronously AND on
  // `astro:page-load` (which also fires on the initial load), so init() would
  // otherwise wire two sets of listeners + observers to the same DOM — and the
  // second init()'s re-seed could clobber the active item just set by a click.
  if (mountEl.dataset.spy === 'on') return;
  mountEl.dataset.spy = 'on';

  // aria-live region announcing the active section label (§12.8).
  const live = document.createElement('div');
  live.setAttribute('aria-live', 'polite');
  live.className = 'visually-hidden';
  document.body.appendChild(live);

  // Progress bar + section tag (§9.1, tablet/mobile). One section may map to
  // several buttons (sidebar + drawer); the tag mirrors the active section.
  const progressFill = progressBar?.querySelector<HTMLElement>('.progress-fill') ?? null;
  const progressCurrent = progressBar?.querySelector<HTMLElement>('.progress-current') ?? null;
  const progressLabel = progressBar?.querySelector<HTMLElement>('.progress-label') ?? null;
  const sectionIndex = new Map(sections.map((s, i) => [s.id, i]));
  const total = sections.length;

  // The same data-target may appear on multiple buttons; map id -> all buttons.
  const byId = new Map<string, HTMLButtonElement[]>();
  for (const b of items) {
    const t = b.dataset.target!;
    (byId.get(t) ?? byId.set(t, []).get(t)!).push(b);
  }
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
    const els = byId.get(id);
    if (els && els.length) {
      els.forEach((el) => {
        el.classList.add('active');
        el.setAttribute('aria-current', 'location');
      });
      // Announce/label from the section's TOC label text. Prefer a button that
      // carries a dedicated `.toc-label` span (the sidebar); otherwise read the
      // button text minus its leading `.num` (the drawer markup).
      const labelled = els.find((el) => el.querySelector('.toc-label'));
      let label: string;
      if (labelled) {
        label = labelled.querySelector('.toc-label')!.textContent ?? '';
      } else {
        const btn = els[0];
        label = (btn.textContent ?? '').replace(btn.querySelector('.num')?.textContent ?? '', '');
      }
      live.textContent = label;
      // Update the progress section tag ("05 / 07 · A phased approach").
      if (progressCurrent) {
        const idx = sectionIndex.get(id) ?? 0;
        progressCurrent.textContent = String(idx + 1).padStart(2, '0');
      }
      if (progressLabel) progressLabel.textContent = label.trim();
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
        toc?.classList.toggle('hidden', tocHidden);
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
  // Mobile TOC drawer: a disclosure on the progress tag. The tag button toggles
  // the panel listing the same .toc-item buttons; aria-expanded mirrors state.
  const tagBtn = progressBar?.querySelector<HTMLButtonElement>('.progress-tag') ?? null;
  const drawer = progressBar?.querySelector<HTMLElement>('.progress-drawer') ?? null;
  const setDrawer = (open: boolean) => {
    if (!tagBtn || !drawer) return;
    tagBtn.setAttribute('aria-expanded', String(open));
    drawer.hidden = !open;
  };
  if (tagBtn && drawer) {
    tagBtn.addEventListener('click', () =>
      setDrawer(tagBtn.getAttribute('aria-expanded') !== 'true')
    );
    // Esc closes the drawer and returns focus to the tag button.
    drawer.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setDrawer(false);
        tagBtn.focus();
      }
    });
  }

  items.forEach((btn) =>
    btn.addEventListener('click', () => {
      const id = btn.dataset.target!;
      const target = document.getElementById(id);
      if (!target) return;
      pinnedId = id;
      setActive(id);
      // A drawer item navigates then collapses the drawer.
      if (btn.classList.contains('toc-item--drawer')) setDrawer(false);
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    })
  );

  // Top progress bar fill: percentage of the article scrolled through (§9.1).
  // Measured from the first to last section so the bar reads 0% at the start of
  // the body and 100% at the end of the final section.
  const updateProgress = () => {
    if (!progressFill) return;
    const first = sections[0];
    const last = sections[total - 1];
    const startY = first.offsetTop;
    const endY = last.offsetTop + last.offsetHeight;
    const span = Math.max(1, endY - startY - window.innerHeight);
    const pct = Math.min(100, Math.max(0, ((window.scrollY - startY) / span) * 100));
    progressFill.style.width = `${pct}%`;
  };
  if (progressFill) {
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress, { passive: true });
    updateProgress();
  }

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
