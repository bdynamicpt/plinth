import { useCallback, type Ref, type RefCallback } from 'react';

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

/**
 * `swipeToClose()` on a component's dialog, as a callback ref that also sets the project's own
 * `ref`, while the dialog is mounted.
 */
export function useSwipeToClose(
  ref: Ref<HTMLDialogElement> | undefined,
): RefCallback<HTMLDialogElement> {
  return useCallback(
    (dialog: HTMLDialogElement) => {
      const stop = swipeToClose(dialog);
      const unset = setRef(ref, dialog);
      return () => {
        stop();
        unset();
      };
    },
    [ref],
  );
}

/** Sets a ref, as React does, and returns what unsets it. */
function setRef<T>(ref: Ref<T> | undefined, value: T): () => void {
  if (typeof ref === 'function') {
    const cleanup = ref(value);
    return typeof cleanup === 'function' ? cleanup : () => ref(null);
  }
  if (ref) {
    ref.current = value;
    return () => {
      ref.current = null;
    };
  }
  return () => {};
}
