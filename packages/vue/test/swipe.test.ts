import { mount } from '@vue/test-utils';
import { defineComponent, h, ref } from 'vue';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { swipeToClose, useSwipeToClose } from '../src/index.ts';

/** A bottom panel: the root, its panel, and in it the handle and the header. */
function bottomPanel(snap?: string) {
  const dialog = document.createElement('dialog');
  dialog.setAttribute('closedby', 'any');
  if (snap) dialog.dataset.snap = snap;
  dialog.innerHTML = '<div><div></div><div><button>Close</button></div></div>';
  document.body.append(dialog);
  dialog.close = vi.fn();
  Object.defineProperty(dialog, 'open', { value: true, configurable: true });
  return dialog;
}

const rect = (element: Element, top: number, bottom = top + 100) =>
  vi.spyOn(element, 'getBoundingClientRect').mockReturnValue({ top, bottom } as DOMRect);

/** The computed styles that matter: the root's scroll snapping, and the snap areas' margins. */
function styles(snapType: string, margins: Map<Element, string> = new Map()) {
  const real = window.getComputedStyle;
  vi.spyOn(window, 'getComputedStyle').mockImplementation(
    (element: Element) =>
      ({
        ...real(element),
        scrollSnapType: element.tagName === 'DIALOG' ? snapType : 'none',
        scrollMarginBlockStart: margins.get(element) ?? '0px',
      }) as CSSStyleDeclaration,
  );
}

const toggle = (newState: string) => Object.assign(new Event('toggle'), { newState });

afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('swipeToClose', () => {
  it('closes the dialog when the scrolling settles with the panel off the bottom edge', () => {
    const dialog = bottomPanel();
    styles('y mandatory');
    rect(dialog, 0, 800);
    const panel = rect(dialog.firstElementChild!, 400);
    swipeToClose(dialog);

    dialog.dispatchEvent(new Event('scrollend'));
    expect(dialog.close).not.toHaveBeenCalled();

    panel.mockReturnValue({ top: 800 } as DOMRect);
    dialog.dispatchEvent(new Event('scrollend'));
    expect(dialog.close).toHaveBeenCalledOnce();
  });

  it('does nothing while the root is not dragged, or once the dialog is closed', () => {
    const dialog = bottomPanel();
    styles('none');
    rect(dialog, 0, 800);
    rect(dialog.firstElementChild!, 800);
    swipeToClose(dialog);

    dialog.dispatchEvent(new Event('scrollend'));
    dialog.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    dialog.dispatchEvent(toggle('open'));
    Object.defineProperty(dialog, 'open', { value: false });
    dialog.dispatchEvent(new Event('scrollend'));

    expect(dialog.close).not.toHaveBeenCalled();
  });

  it('listens for scroll where the browser has no scrollend', () => {
    const descriptor = Object.getOwnPropertyDescriptor(window, 'onscrollend');
    delete (window as { onscrollend?: unknown }).onscrollend;
    const dialog = bottomPanel();
    styles('y mandatory');
    rect(dialog, 0, 800);
    rect(dialog.firstElementChild!, 800);
    const stop = swipeToClose(dialog);

    dialog.dispatchEvent(new Event('scroll'));
    expect(dialog.close).toHaveBeenCalledOnce();
    stop();
    if (descriptor) Object.defineProperty(window, 'onscrollend', descriptor);
  });

  it('asks to close where the browser can, and goes back to open when cancel keeps it', () => {
    const dialog = bottomPanel();
    styles('y mandatory');
    const requestClose = vi.fn();
    Object.assign(dialog, { requestClose });
    dialog.scrollTop = -500;
    swipeToClose(dialog);

    dialog.click();

    expect(requestClose).toHaveBeenCalledOnce();
    expect(dialog.close).not.toHaveBeenCalled();
    expect(dialog.scrollTop).toBe(0);
  });

  it('closes on a tap on the root above the panel when closedby is any', () => {
    const dialog = bottomPanel();
    styles('y mandatory');
    swipeToClose(dialog);

    dialog.querySelector('button')!.click();
    expect(dialog.close).not.toHaveBeenCalled();

    dialog.click();
    expect(dialog.close).toHaveBeenCalledOnce();

    dialog.setAttribute('closedby', 'closerequest');
    dialog.click();
    expect(dialog.close).toHaveBeenCalledOnce();
  });

  it('opens a drawer at its snap point: the handle is peek, the header half', () => {
    for (const [snap, area, margin, expected] of [
      ['peek', 0, '640px', -600],
      ['half', 1, '400px', -330],
    ] as const) {
      vi.restoreAllMocks();
      const dialog = bottomPanel(snap);
      const target = dialog.firstElementChild!.children[area]!;
      styles('y mandatory', new Map([[target, margin]]));
      rect(dialog, 10, 810);
      rect(target, area === 0 ? 50 : 80);
      swipeToClose(dialog);

      dialog.dispatchEvent(toggle('closed'));
      expect(dialog.scrollTop).toBe(0);
      dialog.dispatchEvent(toggle('open'));
      expect(dialog.scrollTop).toBe(expected);
    }
  });

  it('leaves a drawer at full, or with no snap point, where the browser opens it', () => {
    for (const snap of ['full', undefined]) {
      vi.restoreAllMocks();
      const dialog = bottomPanel(snap);
      styles('y mandatory');
      swipeToClose(dialog);

      dialog.dispatchEvent(toggle('open'));
      expect(dialog.scrollTop).toBe(0);
    }
  });

  it('removes its listeners', () => {
    const dialog = bottomPanel();
    styles('y mandatory');
    swipeToClose(dialog)();

    dialog.click();
    expect(dialog.close).not.toHaveBeenCalled();
  });
});

describe('useSwipeToClose', () => {
  it('listens from mounting to unmounting', () => {
    styles('y mandatory');
    const Panel = defineComponent({
      setup() {
        const dialog = ref<HTMLDialogElement>();
        useSwipeToClose(dialog);
        return () => h('dialog', { ref: dialog, closedby: 'any' }, [h('div')]);
      },
    });
    const wrapper = mount(Panel, { attachTo: document.body });
    const dialog = wrapper.element as HTMLDialogElement;
    dialog.close = vi.fn();

    dialog.click();
    expect(dialog.close).toHaveBeenCalledOnce();

    wrapper.unmount();
    dialog.click();
    expect(dialog.close).toHaveBeenCalledOnce();
  });

  it('does nothing without a dialog', () => {
    const Empty = defineComponent({
      setup() {
        useSwipeToClose(ref());
        return () => h('div');
      },
    });

    expect(() => mount(Empty).unmount()).not.toThrow();
  });
});
