/** Homepage film: a silent preview, scroll composition, and a native dialog. */
export function initSpecimenHero() {
  const hero = document.querySelector<HTMLElement>('[data-specimen-hero]');
  if (!hero || hero.dataset.ready) return;
  hero.dataset.ready = 'true';
  const wash = hero.querySelector<HTMLElement>('.stage-wash')!;
  const shell = hero.querySelector<HTMLElement>('.film-shell')!;
  const frame = hero.querySelector<HTMLAnchorElement>('.film-frame')!;
  const teaser = hero.querySelector<HTMLVideoElement>('.film-teaser')!;
  const toggle = hero.querySelector<HTMLButtonElement>('.teaser-toggle')!;
  const dialog = hero.querySelector<HTMLDialogElement>('.film-theater')!;
  const panel = hero.querySelector<HTMLElement>('.theater-panel')!;
  const picture = hero.querySelector<HTMLElement>('.theater-picture')!;
  const player = hero.querySelector<HTMLVideoElement>('.film-full')!;
  const snapshot = hero.querySelector<HTMLImageElement>('.theater-snapshot')!;
  const closeButton = hero.querySelector<HTMLButtonElement>('.theater-close')!;
  const ended = hero.querySelector<HTMLElement>('.film-ended')!;
  const status = hero.querySelector<HTMLElement>('.film-status')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 767px)');
  const events = new AbortController();
  const { signal } = events;
  let userPaused = false;
  let visible = true;
  let closing = false;
  let scrollFrame = 0;
  let trigger: HTMLElement = frame;
  let animation: Animation | undefined;
  let savedOverflow = '';
  let savedGutter = '';
  let savedScroll = 0;

  const syncPreview = () => {
    const allowed = !reduce.matches && !mobile.matches;
    toggle.hidden = !allowed;
    if (!allowed || !visible || userPaused || dialog.open || document.hidden) {
      teaser.pause();
      if (!allowed) teaser.classList.remove('is-playing');
      return;
    }
    if (!teaser.src) teaser.src = teaser.dataset.src!;
    teaser.muted = true;
    teaser.play().catch(() => { toggle.hidden = true; });
  };
  teaser.addEventListener('playing', () => teaser.classList.add('is-playing'), { signal });
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    const label = userPaused ? 'Resume preview' : 'Pause preview';
    toggle.setAttribute('aria-label', label);
    toggle.querySelector('span')!.textContent = label;
    syncPreview();
  }, { signal });

  const paintScroll = () => {
    scrollFrame = 0;
    const p = reduce.matches ? 0 : Math.max(0, Math.min(1, scrollY / (innerHeight * 0.65)));
    wash.style.clipPath = `inset(0 0 ${p * 100}% 0)`;
    shell.style.transform = `translateY(${p * (mobile.matches ? 6 : 24)}px) scale(${1 - p * (mobile.matches ? 0.025 : 0.14)})`;
    frame.style.borderRadius = `${p * 12}px`;
  };
  const onScroll = () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(paintScroll); };
  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', onScroll, { passive: true, signal });
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncPreview();
  }, { threshold: 0.15 });
  observer.observe(frame);
  const preferenceChange = () => { paintScroll(); syncPreview(); };
  reduce.addEventListener('change', preferenceChange, { signal });
  mobile.addEventListener('change', preferenceChange, { signal });
  document.addEventListener('visibilitychange', syncPreview, { signal });
  paintScroll();

  // Entrance is cosmetic; the complete poster and navigation exist without it.
  try {
    if (!reduce.matches && !sessionStorage.getItem('specimen-intro-seen') && scrollY < 80) {
      frame.animate([
        { clipPath: 'inset(100% 0 0 0)', opacity: 0.7, transform: 'translateY(18px)' },
        { clipPath: 'inset(0 0 0 0)', opacity: 1, transform: 'translateY(0)' },
      ], { duration: 750, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
      hero.querySelector('.stage-rule')!.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: 800, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' });
    }
    sessionStorage.setItem('specimen-intro-seen', 'true');
  } catch { /* Storage may be unavailable; the film is still fully usable. */ }

  const unlockScroll = () => {
    document.documentElement.style.overflowY = savedOverflow;
    document.documentElement.style.scrollbarGutter = savedGutter;
  };
  const motion = (from: DOMRect, to: DOMRect, reverse = false) => {
    const transform = `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${from.width / to.width}, ${from.height / to.height})`;
    // Animate only the picture; controls remain readable and keyboard reachable.
    const keyframes = [{ transform, borderRadius: getComputedStyle(frame).borderRadius }, { transform: 'none', borderRadius: '6px' }];
    if (reverse) keyframes.reverse();
    return picture.animate(keyframes, { duration: reduce.matches ? 0 : reverse ? 350 : 480, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
  };
  picture.style.transformOrigin = 'top left';

  const openFilm = (event: Event) => {
    event.preventDefault();
    if (dialog.open) return;
    trigger = event.currentTarget as HTMLElement;
    savedScroll = scrollY;
    const origin = frame.getBoundingClientRect();
    // Hold the actual preview frame while the full film buffers and expands.
    snapshot.src = player.poster;
    if (teaser.readyState >= 2 && teaser.classList.contains('is-playing')) {
      const canvas = document.createElement('canvas');
      canvas.width = teaser.videoWidth;
      canvas.height = teaser.videoHeight;
      canvas.getContext('2d')!.drawImage(teaser, 0, 0);
      snapshot.src = canvas.toDataURL('image/jpeg', 0.85);
    }
    teaser.pause();
    ended.hidden = true;
    panel.classList.remove('is-opened', 'is-playing');
    savedOverflow = document.documentElement.style.overflowY;
    savedGutter = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = 'stable';
    document.documentElement.style.overflowY = 'hidden';
    dialog.showModal();
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
    closeButton.focus({ preventScroll: true });
    if (!player.src) player.src = player.dataset.src!;
    player.currentTime = 0;
    player.muted = false;
    status.textContent = 'Loading the film…';
    // Call play during the click, before awaiting animation, to retain sound permission.
    player.play().catch(() => {
      panel.classList.add('is-playing');
      status.textContent = 'Press play to start the film.';
    });
    animation = motion(origin, picture.getBoundingClientRect());
    animation.finished.then(() => {
      if (!closing && dialog.open) panel.classList.add('is-opened');
    }).catch(() => {});
  };
  frame.addEventListener('click', openFilm, { signal });
  hero.querySelector('[data-play-film]')!.addEventListener('click', openFilm, { signal });
  player.addEventListener('playing', () => {
    panel.classList.add('is-playing');
    status.textContent = 'Design. Engineering. A little of everything in between.';
  }, { signal });
  player.addEventListener('error', () => {
    panel.classList.add('is-playing');
    status.textContent = 'The film could not load. Close and try again.';
  }, { signal });
  player.addEventListener('ended', () => { ended.hidden = false; }, { signal });

  const closeFilm = async () => {
    if (!dialog.open || closing) return;
    closing = true;
    player.pause();
    animation?.cancel();
    animation = motion(frame.getBoundingClientRect(), picture.getBoundingClientRect(), true);
    await animation.finished.catch(() => {});
    dialog.close();
    animation.cancel();
    unlockScroll();
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
    closing = false;
    trigger.focus({ preventScroll: true });
    syncPreview();
  };
  closeButton.addEventListener('click', closeFilm, { signal });
  dialog.addEventListener('cancel', (event) => { event.preventDefault(); void closeFilm(); }, { signal });
  dialog.addEventListener('click', (event) => { if (event.target === dialog) void closeFilm(); }, { signal });
  hero.querySelector('[data-film-work]')!.addEventListener('click', async () => {
    await closeFilm();
    const work = document.getElementById('selected-work')!;
    work.focus({ preventScroll: true });
    work.scrollIntoView({ behavior: reduce.matches ? 'instant' : 'smooth' });
  }, { signal });
  hero.querySelector('[data-film-replay]')!.addEventListener('click', () => {
    ended.hidden = true;
    player.currentTime = 0;
    void player.play();
  }, { signal });

  document.addEventListener('astro:before-swap', () => {
    events.abort();
    observer.disconnect();
    cancelAnimationFrame(scrollFrame);
    animation?.cancel();
    teaser.pause();
    player.pause();
    if (dialog.open) { dialog.close(); unlockScroll(); }
  }, { once: true, signal });
}
