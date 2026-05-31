/**
 * Native <dialog> lightbox island (§8.4).
 *
 * A single <dialog> is appended once. Clicking any `[data-zoomable] img` opens it
 * with that image cloned in, focus moves to the subtle × close button, Tab is
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
  let lastTrigger: HTMLElement | null = null;

  const open = (src: string, alt: string, trigger: HTMLElement) => {
    lastTrigger = trigger;
    img.src = src;
    img.alt = alt;
    cap.textContent = alt;
    dialog.showModal();
    closeBtn.focus();
  };
  const close = () => {
    dialog.close();
    lastTrigger?.focus();
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
    wrap.style.cursor = 'zoom-in';
    // The zoomable wrappers are <div>s, so make them keyboard-operable: focusable
    // in tab order, exposed as a button, and openable with Enter / Space. Without
    // this a keyboard user cannot open the lightbox, and focus could not be
    // restored to the trigger on close (a tabindex-less div is not focusable).
    if (!wrap.hasAttribute('tabindex')) wrap.setAttribute('tabindex', '0');
    if (!wrap.hasAttribute('role')) wrap.setAttribute('role', 'button');
    if (!wrap.hasAttribute('aria-label')) {
      wrap.setAttribute('aria-label', i.alt ? `Enlarge image: ${i.alt}` : 'Enlarge image');
    }
    wrap.addEventListener('click', () => open(i.src, i.alt, wrap));
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(i.src, i.alt, wrap);
      }
    });
  });

  closeBtn.addEventListener('click', close);
  // Outside-click (backdrop) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Esc fires native `cancel`; restore focus to the trigger.
  dialog.addEventListener('cancel', () => lastTrigger?.focus());

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
    if (e.shiftKey) {
      if (active === first || !dialog.contains(active)) {
        e.preventDefault();
        last.focus();
      }
    } else if (active === last || !dialog.contains(active)) {
      e.preventDefault();
      first.focus();
    }
  });
}
