/** Homepage film: a native dialog opened from the hero's "Watch my story" button. */
export function initSpecimenHero() {
  const hero = document.querySelector<HTMLElement>('[data-specimen-hero]');
  if (!hero || hero.dataset.ready) return;
  hero.dataset.ready = 'true';
  const watch = hero.querySelector<HTMLAnchorElement>('[data-play-film]')!;
  const dialog = hero.querySelector<HTMLDialogElement>('.film-theater')!;
  const panel = hero.querySelector<HTMLElement>('.theater-panel')!;
  const picture = hero.querySelector<HTMLElement>('.theater-picture')!;
  const player = hero.querySelector<HTMLVideoElement>('.film-full')!;
  const snapshot = hero.querySelector<HTMLImageElement>('.theater-snapshot')!;
  const closeButton = hero.querySelector<HTMLButtonElement>('.theater-close')!;
  const ended = hero.querySelector<HTMLElement>('.film-ended')!;
  const status = hero.querySelector<HTMLElement>('.film-status')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const { signal } = events;
  let closing = false;
  let animation: Animation | undefined;
  let savedOverflow = '';
  let savedGutter = '';
  let savedScroll = 0;
  let videoStarted = false;
  let videoCompleted = false;
  let videoSource = 'watch_button';
  let previousPercent = 0;
  const milestones = new Set<number>();

  // Resuming playback doesn't count as another start; opening or replaying
  // begins a new viewing.
  const trackVideo = (name: string, percent = Math.round(player.currentTime / player.duration * 100) || 0) => {
    const analytics = (window as Window & { gtag?: (command: string, event: string, parameters: Record<string, unknown>) => void }).gtag;
    analytics?.('event', name, {
      video_title: player.getAttribute('aria-label'),
      video_url: new URL(player.dataset.src!, location.origin).href,
      video_provider: 'html5',
      video_current_time: Math.round(player.currentTime) || 0,
      video_duration: Math.round(player.duration) || 0,
      video_percent: percent,
      video_source: videoSource,
      visible: dialog.open && !document.hidden,
    });
  };
  const resetVideoTracking = (source: string) => {
    videoSource = source;
    videoStarted = false;
    videoCompleted = false;
    previousPercent = 0;
    milestones.clear();
  };
  player.addEventListener('seeking', () => {
    previousPercent = player.currentTime / player.duration * 100;
  }, { signal });
  player.addEventListener('timeupdate', () => {
    if (!dialog.open || !videoStarted || player.seeking || player.paused) return;
    const percent = player.currentTime / player.duration * 100;
    for (const milestone of [10, 25, 50, 75]) {
      if (previousPercent < milestone && percent >= milestone && !milestones.has(milestone)) {
        milestones.add(milestone);
        trackVideo('video_progress', milestone);
      }
    }
    previousPercent = percent;
  }, { signal });

  const unlockScroll = () => {
    document.documentElement.style.overflowY = savedOverflow;
    document.documentElement.style.scrollbarGutter = savedGutter;
  };
  // No on-page frame to grow from any more: the picture fades up and settles.
  const motion = (reverse = false) => {
    const keyframes = [{ opacity: 0, transform: 'translateY(12px) scale(0.98)' }, { opacity: 1, transform: 'none' }];
    if (reverse) keyframes.reverse();
    return picture.animate(keyframes, { duration: reduce.matches ? 0 : reverse ? 220 : 320, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'both' });
  };

  const openFilm = (event: Event) => {
    event.preventDefault();
    if (dialog.open) return;
    savedScroll = scrollY;
    // Hold the poster while the full film buffers.
    snapshot.src = player.poster;
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
    resetVideoTracking('watch_button');
    trackVideo('video_open', 0);
    status.textContent = 'Loading the film…';
    // Call play during the click, before awaiting animation, to retain sound permission.
    player.play().catch(() => {
      panel.classList.add('is-playing');
      status.textContent = 'Press play to start the film.';
    });
    animation = motion();
    animation.finished.then(() => {
      if (!closing && dialog.open) panel.classList.add('is-opened');
    }).catch(() => {});
  };
  watch.addEventListener('click', openFilm, { signal });
  player.addEventListener('playing', () => {
    if (dialog.open && !videoStarted) {
      videoStarted = true;
      trackVideo('video_start', 0);
    }
    panel.classList.add('is-playing');
    status.textContent = 'Design. Engineering. A little of everything in between.';
  }, { signal });
  player.addEventListener('error', () => {
    panel.classList.add('is-playing');
    status.textContent = 'The film could not load. Close and try again.';
  }, { signal });
  player.addEventListener('ended', () => {
    ended.hidden = false;
    if (dialog.open && videoStarted && !videoCompleted) {
      videoCompleted = true;
      trackVideo('video_complete', 100);
    }
  }, { signal });

  const closeFilm = async () => {
    if (!dialog.open || closing) return;
    closing = true;
    player.pause();
    animation?.cancel();
    animation = motion(true);
    await animation.finished.catch(() => {});
    dialog.close();
    animation.cancel();
    unlockScroll();
    window.scrollTo({ top: savedScroll, behavior: 'instant' });
    closing = false;
    watch.focus({ preventScroll: true });
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
    resetVideoTracking('replay');
    void player.play();
  }, { signal });

  document.addEventListener('astro:before-swap', () => {
    events.abort();
    animation?.cancel();
    player.pause();
    if (dialog.open) { dialog.close(); unlockScroll(); }
  }, { once: true, signal });
}
