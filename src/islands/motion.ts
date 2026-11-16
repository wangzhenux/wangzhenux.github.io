/**
 * Case motion island (cases with `caseMotion: true`, Portal first).
 *
 * Small and once: numbers count up, the timeline draws itself and the funnel
 * bars grow as each scrolls into view. Walkthroughs keep their step list in
 * place and swap the screen as the reader scrolls (that one is state, not
 * motion, so it runs under reduced motion too, without the crossfade).
 *
 * How sections come into view is not this island's job: that stays the site's
 * shared reveal (reveal.ts, [data-reveal]) until a new shared style replaces it
 * on every page at once.
 *
 * Degradation-safe like reveal.ts: everything is complete in the markup. Only
 * when motion is allowed does this add `motion-armed` to <html>, which arms the
 * hidden states in CSS; reduced motion or no IntersectionObserver leaves the
 * page exactly as written.
 */
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Run `fn` once, the first time `el` is at least `ratio` in view. */
function once(els: Element[], fn: (el: HTMLElement) => void, rootMargin = '0px 0px -12% 0px') {
  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        obs.unobserve(e.target);
        fn(e.target as HTMLElement);
      }
    },
    { rootMargin, threshold: 0 }
  );
  els.forEach((el) => io.observe(el));
}

/* ── Count-ups ──────────────────────────────────────────────────────────── */
function parseCount(raw: string) {
  const m = raw.trim().match(/^([^\d]*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!m) return null;
  const num = parseFloat(m[2].replace(/,/g, ''));
  const decimals = (m[2].split('.')[1] ?? '').length;
  return { prefix: m[1], num, decimals, suffix: m[3], comma: m[2].includes(',') };
}
function fmt(n: number, p: NonNullable<ReturnType<typeof parseCount>>, done: boolean) {
  let s = n.toFixed(p.decimals);
  if (p.comma) s = Number(s).toLocaleString('en-US', { minimumFractionDigits: p.decimals });
  // A trailing "+" reads as "more than", so it arrives with the final number.
  const suffix = done || p.suffix.trim() !== '+' ? p.suffix : '';
  return `${p.prefix}${s}${suffix}`;
}
function armCount(el: HTMLElement) {
  const final = el.dataset.count || el.textContent || '';
  const p = parseCount(final);
  if (!p) return;
  el.style.display = 'inline-block';
  el.style.minWidth = `${el.getBoundingClientRect().width}px`;
  el.textContent = fmt(0, p, false);
  el.dataset.countFinal = final;
}
function runCount(el: HTMLElement) {
  const final = el.dataset.countFinal;
  if (final == null) return;
  const p = parseCount(final)!;
  const dur = 900;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    if (k < 1) {
      el.textContent = fmt(p.num * eased, p, false);
      requestAnimationFrame(step);
    } else {
      el.textContent = final;
      el.style.minWidth = '';
    }
  };
  requestAnimationFrame(step);
}

/* ── Walkthrough: pinned list, the screen swaps as the reader scrolls ────── */
function initWalkthrough(root: HTMLElement) {
  if (root.dataset.wtInit) return;
  root.dataset.wtInit = '1';
  const stage = root.querySelector<HTMLElement>('.wt-stage');
  const steps = Array.from(root.querySelectorAll<HTMLElement>('.wt-step'));
  const figs = Array.from(root.querySelectorAll<HTMLElement>('.wt-fig'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('.wt-dot'));
  if (!stage || steps.length < 2) return;
  const wide = window.matchMedia('(min-width: 960px)');
  let current = 0;
  const set = (i: number) => {
    if (i === current) return;
    current = i;
    steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
    figs.forEach((f, k) => f.classList.toggle('is-active', k === i));
    dots.forEach((d, k) => d.setAttribute('aria-current', k === i ? 'true' : 'false'));
  };
  root.classList.add('is-armed');

  // Stage height = the taller of the list and the tallest screen, so the pinned
  // pair never jumps as screens of different heights swap in.
  const measure = () => {
    root.classList.toggle('is-staged', wide.matches);
    if (!wide.matches) return;
    root.style.setProperty('--wt-stage-h', `${Math.ceil(stage.getBoundingClientRect().height)}px`);
  };
  const stepPx = () => parseFloat(getComputedStyle(root).getPropertyValue('--wt-step')) || 240;
  const stickyTop = () => parseFloat(getComputedStyle(stage).top) || 0;
  // Narrow: the distance from one card of the swipe row to the next.
  const cardPx = () => steps[1].getBoundingClientRect().left - steps[0].getBoundingClientRect().left;

  let raf = 0;
  const update = () => {
    raf = 0;
    if (wide.matches) {
      // How far the block has scrolled past the point where the stage pins.
      const past = stickyTop() - root.getBoundingClientRect().top;
      set(Math.max(0, Math.min(steps.length - 1, Math.round(past / stepPx()))));
    } else {
      // Swipe row: the card nearest the start of the row.
      const card = cardPx();
      if (card > 0) set(Math.max(0, Math.min(steps.length - 1, Math.round(stage.scrollLeft / card))));
    }
  };
  const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
  measure();
  update();
  // Measure again once the closed steps have folded (their 0.35 s transition),
  // or the stage keeps the height of the fully open list.
  window.setTimeout(() => { measure(); onScroll(); }, 450);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { measure(); onScroll(); }, { passive: true });
  stage.addEventListener('scroll', onScroll, { passive: true });
  // Late images change the stage's height.
  figs.forEach((f) => f.querySelector('img')?.addEventListener('load', measure, { once: true }));

  // A dot brings its card to the start of the row. So does Tab onto a title:
  // the browser leaves a card that only peeks in where it is. The frame's wait
  // lets any scroll of the browser's own go first.
  const goTo = (i: number) => stage.scrollTo({ left: i * cardPx(), behavior: reduced() ? 'auto' : 'smooth' });
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
  stage.addEventListener('focusin', (ev) => {
    if (wide.matches) return;
    const i = steps.findIndex((s) => s.contains(ev.target as Node));
    if (i >= 0) requestAnimationFrame(() => goTo(i));
  });

  root.querySelectorAll<HTMLAnchorElement>('.wt-link').forEach((a, i) => {
    a.addEventListener('click', (ev) => {
      if (!wide.matches) return; // swipe row: the plain anchor jump is right
      ev.preventDefault();
      const top = root.getBoundingClientRect().top + window.scrollY - stickyTop() + i * stepPx() + 1;
      window.scrollTo({ top, behavior: reduced() ? 'auto' : 'smooth' });
    });
  });
}

export function init(): void {
  const main = document.querySelector<HTMLElement>('main[data-motion="on"]');
  if (!main || main.dataset.motionInit) return;
  main.dataset.motionInit = '1';
  if (!('IntersectionObserver' in window)) return;

  // Walkthroughs follow the scroll even under reduced motion (no transitions).
  main.querySelectorAll<HTMLElement>('[data-wt]').forEach(initWalkthrough);

  if (reduced()) return;
  document.documentElement.classList.add('motion-armed');

  const vh = window.innerHeight;
  const below = (el: Element) => el.getBoundingClientRect().top > vh * 0.88;

  // Numbers.
  const counts = Array.from(main.querySelectorAll<HTMLElement>('[data-count]')).filter(below);
  counts.forEach(armCount);
  once(counts, runCount, '0px 0px -18% 0px');

  // Timeline and funnel bars: draw once in view.
  const draw = Array.from(main.querySelectorAll<HTMLElement>('[data-tl], .fb'));
  draw.filter((el) => !below(el)).forEach((el) => el.classList.add('is-in'));
  once(draw.filter(below), (el) => el.classList.add('is-in'), '0px 0px -20% 0px');
}
