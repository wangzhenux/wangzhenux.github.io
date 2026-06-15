/**
 * Off-screen gallery filter island.
 *
 * Wires the category chips to show/hide tiles by `data-cat`. Each chip is a real
 * <button> with `aria-pressed`; a visually-hidden live region announces the
 * count after each change. Idempotent (guards a re-mount flag) so it is safe to
 * re-run on `astro:page-load` after a view-transition navigation.
 */
export function init(): void {
  document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((root) => {
    if (root.dataset.galleryInit) return;
    root.dataset.galleryInit = '1';

    const chips = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-filter]'));
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('[data-cat]'));
    const live = root.querySelector<HTMLElement>('[data-gallery-live]');
    if (!chips.length || !tiles.length) return;

    const apply = (filter: string) => {
      let shown = 0;
      tiles.forEach((tile) => {
        const visible = filter === 'all' || tile.dataset.cat === filter;
        tile.hidden = !visible;
        if (visible) shown += 1;
      });
      chips.forEach((chip) =>
        chip.setAttribute('aria-pressed', String(chip.dataset.filter === filter)),
      );
      if (live) live.textContent = `Showing ${shown} ${shown === 1 ? 'piece' : 'pieces'}`;
    };

    chips.forEach((chip) =>
      chip.addEventListener('click', () => apply(chip.dataset.filter || 'all')),
    );
  });
}
