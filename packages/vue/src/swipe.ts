import { onBeforeUnmount, onMounted, type Ref } from 'vue';

/**
 * What a bottom panel on a phone needs beyond the platform (modal.css, docs/adr/0005): the
 * dialog, sheet and drawer are dragged by native scrolling, and this closes the dialog when the
 * scrolling settles with the panel off the bottom edge, closes it on a tap above the panel when
 * it has `closedby="any"`, and opens a drawer at its `data-snap` point. It does nothing while the
 * root isn't a scroll-snap container (from 768px up, or a panel with no handle). Returns what
 * removes the listeners.
 */
export function swipeToClose(dialog: HTMLDialogElement): () => void {
  const panel = dialog.firstElementChild!;
  const dragging = () => getComputedStyle(dialog).scrollSnapType.startsWith('y');
  const settle = () => {
    const off = panel.getBoundingClientRect().top >= dialog.getBoundingClientRect().bottom - 1;
    if (dialog.open && dragging() && off) dialog.close();
  };
  const tap = (event: Event) => {
    if (event.target === dialog && dragging() && dialog.getAttribute('closedby') === 'any') {
      dialog.close();
    }
  };
  const open = (event: Event) => {
    // The handle is the peek snap area, the header the half one (drawer.css).
    const [handle, header] = panel.children;
    const area = { peek: handle, half: header }[dialog.dataset.snap ?? ''];
    if ((event as ToggleEvent).newState !== 'open' || !area || !dragging()) return;
    const margin = parseFloat(getComputedStyle(area).scrollMarginBlockStart);
    dialog.scrollTop +=
      area.getBoundingClientRect().top - dialog.getBoundingClientRect().top - margin;
  };
  const end = 'onscrollend' in window ? 'scrollend' : 'scroll';
  dialog.addEventListener(end, settle);
  dialog.addEventListener('click', tap);
  dialog.addEventListener('toggle', open);
  return () => {
    dialog.removeEventListener(end, settle);
    dialog.removeEventListener('click', tap);
    dialog.removeEventListener('toggle', open);
  };
}

/** `swipeToClose()` on a component's dialog, from mounting to unmounting. */
export function useSwipeToClose(dialog: Ref<HTMLDialogElement | undefined>): void {
  let stop: (() => void) | undefined;
  onMounted(() => {
    stop = dialog.value ? swipeToClose(dialog.value) : undefined;
  });
  onBeforeUnmount(() => stop?.());
}
