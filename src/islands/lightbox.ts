/**
 * Native <dialog> lightbox island (§8.4).
 *
 * A single <dialog> is appended once. Clicking a `[data-zoomable]` image opens it
 * with that image cloned in, but only when the zoom would show the image clearly
 * bigger (see MIN_GAIN). Focus moves to the subtle × close button, Tab is
 * trapped by the native <dialog>, and Esc / outside-click / × all close it,
 * restoring focus to the trigger.
 */

export function init(): void {
  // Guard against double-mount (CaseInteractions re-runs on astro:page-load).
  if (document.querySelector('dialog.lightbox')) return;

  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Enlarged image');
  dialog.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close">&times;</button>
    <figure class="lightbox-fig"><img alt="" /><figcaption class="lightbox-cap"></figcaption></figure>
    <p class="lightbox-hint">press esc · or click outside</p>`;
  document.body.appendChild(dialog);

  const img = dialog.querySelector('img')!;
  const cap = dialog.querySelector('.lightbox-cap')!;
  const closeBtn = dialog.querySelector<HTMLButtonElement>('.lightbox-close')!;
  // The image the open lightbox came from. Cleared by the close event, which
  // comes after focus is back on it, unless the lightbox has reopened by then.
  let lastTrigger: HTMLElement | null = null;

  const open = (
    src: string,
    alt: string,
    trigger: HTMLElement,
    shown: HTMLImageElement,
    pointer: boolean
  ) => {
    lastTrigger = trigger;
    img.src = src;
    img.alt = alt;
    // An SVG with only a viewBox has no natural size, so `width: auto` drew it
    // smaller than on the page. Scale it to fill the zoom area at the shape it
    // has on the page; photos keep their natural size (never upscaled).
    const r = shown.getBoundingClientRect();
    const svg = /\.svg($|\?)/i.test(src) && r.height > 0;
    // 92vw so a full-width diagram on a phone (about 90vw on the page) still grows.
    img.style.maxWidth = svg ? '92vw' : '';
    img.style.width = svg ? `min(92vw, calc(80vh * ${(r.width / r.height).toFixed(4)}))` : '';
    cap.textContent = alt;
    // Art drawn for ImageShowcase's dark band keeps that band behind it (CSS).
    dialog.toggleAttribute('data-dark-art', !!trigger.closest('.image-showcase--wireframe-dark'));
    dialog.showModal();
    // The close button's ring is for keyboard users. Safari draws it after a
    // tap or click too, since it counts the dialog's own focus move as visible,
    // so there focus moves again without it (focusing the button that already
    // has focus would change nothing, hence the blur). Chrome draws no ring
    // here and is left alone, so a later key press still brings it back.
    if (pointer && closeBtn.matches(':focus-visible')) {
      closeBtn.blur();
      closeBtn.focus({ focusVisible: false });
      // Skip the fade from the ring's full opacity back to 0.85.
      closeBtn.getAnimations().forEach((a) => a.finish());
    } else {
      closeBtn.focus();
    }
  };
  const close = (pointer: boolean) => {
    dialog.close();
    // Safari also draws the ring on the image when the dialog hands focus back
    // after a tap or click, so focus moves again the same way there, without
    // scrolling (the dialog's own hand-back doesn't scroll either). The image
    // stays a button through the blur, since lastTrigger is set until the
    // close event.
    if (pointer && lastTrigger?.matches(':focus-visible')) {
      lastTrigger.blur();
      lastTrigger.focus({ focusVisible: false, preventScroll: true });
    } else {
      lastTrigger?.focus();
    }
  };

  // Zoom is offered only when the lightbox would show the image clearly bigger
  // than the page does: at least MIN_GAIN times as wide in the current window.
  // Full-width images often gain little, or would even come out smaller (the
  // lightbox never upscales and stops at 80vh), so those stay plain images.
  // A wrapper marked data-zoomable="always" offers zoom whatever the gain: the
  // Off-screen gallery, so every tile behaves the same, and BrokeCarousel's tall
  // captures, which the page crops and the zoom shows whole.
  const MIN_GAIN = 1.5;
  // The width the lightbox would draw this image at: open()'s rule for SVGs, and
  // the `.lightbox-fig img` caps (88vw × 80vh, never past natural size) otherwise.
  const zoomedWidth = (i: HTMLImageElement): number => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (/\.svg($|\?)/i.test(i.src)) {
      return i.offsetHeight > 0 ? Math.min(0.92 * vw, 0.8 * vh * (i.offsetWidth / i.offsetHeight)) : 0;
    }
    const w = i.naturalWidth || Number(i.getAttribute('width'));
    const h = i.naturalHeight || Number(i.getAttribute('height'));
    if (!w || !h) return 0;
    return w * Math.min(1, (0.88 * vw) / w, (0.8 * vh) / h);
  };

  // data-zoom="on" | "off" on the wrapper and its img drives the zoom cursor and
  // hover lift in CSS. When on, the wrapper (a <div> or <figure>) is also made
  // keyboard-operable: focusable, exposed as a button, openable with Enter /
  // Space, so focus can return to it on close. When off, only the attributes
  // added here are taken back.
  type Trigger = { wrap: HTMLElement; img: HTMLImageElement; added: string[] };
  const triggers: Trigger[] = [];
  const update = (t: Trigger) => {
    const shown = t.img.offsetWidth;
    const on =
      t.wrap.dataset.zoomable === 'always' || (shown > 0 && zoomedWidth(t.img) >= MIN_GAIN * shown);
    const state = on ? 'on' : 'off';
    if (t.wrap.dataset.zoom === state) return;
    // Keep the button on the image the lightbox was opened from (until it has
    // closed) and on any image that has focus: closing returns focus there, and
    // without its tabindex focus would drop to <body>. It turns off once focus
    // leaves it (focusout below). Other images are inert behind the open
    // lightbox, so they switch at once.
    if (!on && (t.wrap === lastTrigger || t.wrap.contains(document.activeElement))) return;
    t.wrap.dataset.zoom = state;
    t.img.dataset.zoom = state;
    if (on) {
      const attrs: [string, string][] = [
        ['tabindex', '0'],
        ['role', 'button'],
        ['aria-label', t.img.alt ? `Enlarge image: ${t.img.alt}` : 'Enlarge image'],
      ];
      for (const [name, value] of attrs) {
        if (t.wrap.hasAttribute(name)) continue;
        t.wrap.setAttribute(name, value);
        t.added.push(name);
      }
    } else {
      t.added.forEach((name) => t.wrap.removeAttribute(name));
      t.added = [];
    }
  };

  // Only the innermost (leaf) zoomable wrapper becomes the interactive trigger.
  // ImageShowcase wraps its slot in [data-zoomable], and a ShowcaseImage placed
  // inside also carries [data-zoomable] — nesting two would create nested
  // interactive controls (an a11y violation) and double click handlers. Skip any
  // wrapper that itself contains another [data-zoomable].
  document.querySelectorAll<HTMLElement>('[data-zoomable]').forEach((wrap) => {
    if (wrap.querySelector('[data-zoomable]')) return;
    const i = wrap.querySelector('img');
    if (!i) return;
    const t: Trigger = { wrap, img: i, added: [] };
    triggers.push(t);
    update(t);
    // The natural size is only certain once the image has loaded.
    if (!i.complete) i.addEventListener('load', () => update(t), { once: true });
    // A screen reader or switch activates the button with a click of detail 0;
    // only a real click or tap (detail 1 or more) counts as a pointer open.
    wrap.addEventListener('click', (e) => {
      if (wrap.dataset.zoom === 'on') open(i.src, i.alt, wrap, i, e.detail > 0);
    });
    wrap.addEventListener('keydown', (e) => {
      if (wrap.dataset.zoom === 'on' && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        open(i.src, i.alt, wrap, i, false);
      }
    });
    // A trigger kept on only because it had focus turns off as soon as focus
    // moves elsewhere on the page: during that focusout, activeElement is
    // already <body>, so the guard in update lets it go. If the window loses
    // focus instead, the trigger is still the active element and stays on.
    wrap.addEventListener('focusout', () => update(t));
  });

  // Check again when the window changes size. ClientRouter keeps the window
  // across page swaps, so the listener removes itself once its page is gone.
  let frame = 0;
  const onResize = () => {
    if (!triggers.some((t) => t.wrap.isConnected)) {
      removeEventListener('resize', onResize);
      return;
    }
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => triggers.forEach(update));
  };
  addEventListener('resize', onResize, { passive: true });

  // Enter or Space on the × also fires click, with detail 0: a keyboard close.
  closeBtn.addEventListener('click', (e) => close(e.detail > 0));
  // Outside-click (backdrop) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close(true);
  });
  // Esc fires native `cancel`; restore focus to the trigger.
  dialog.addEventListener('cancel', () => lastTrigger?.focus());
  dialog.addEventListener('close', () => {
    if (!dialog.open) lastTrigger = null;
  });

  // Explicit focus trap (§8.4 / §10.1). A native <dialog> with a single
  // focusable child does not reliably trap Tab in Chromium — focus can escape to
  // <body>. Cycle focus among the dialog's focusable elements so Tab / Shift+Tab
  // stay inside.
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const focusable = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el) => !el.hasAttribute('disabled'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement as HTMLElement | null;
    // Tab is keyboard use, so the ring shows. Focusing the element that already
    // has focus changes nothing, and after a tap or click open Safari keeps it
    // without the ring, so then focus moves again with the ring.
    const move = (to: HTMLElement) => {
      e.preventDefault();
      if (to === active && !to.matches(':focus-visible')) {
        to.blur();
        to.focus({ focusVisible: true });
      } else {
        to.focus();
      }
    };
    if (e.shiftKey) {
      if (active === first || !dialog.contains(active)) move(last);
    } else if (active === last || !dialog.contains(active)) {
      move(first);
    }
  });
}
