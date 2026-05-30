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

  document.querySelectorAll<HTMLElement>('[data-zoomable]').forEach((wrap) => {
    const i = wrap.querySelector('img');
    if (!i) return;
    wrap.style.cursor = 'zoom-in';
    wrap.addEventListener('click', () => open(i.src, i.alt, wrap));
  });

  closeBtn.addEventListener('click', close);
  // Outside-click (backdrop) closes.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });
  // Esc fires native `cancel`; restore focus to the trigger.
  dialog.addEventListener('cancel', () => lastTrigger?.focus());
}
