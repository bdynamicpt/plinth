import { mount } from '@vue/test-utils';
import { Comment, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import {
  PlinthDrawer,
  drawerCloseIcon,
  drawerDesktop,
  drawerSnap,
  drawerSnapPoints,
} from '../src/index.ts';

const close =
  '<button type="button" class="plinth-button plinth-icon-button plinth-drawer-close" data-variant="ghost" data-size="md" aria-label="Close" commandfor="route" command="close">' +
  `<span class="plinth-icon" data-size="md" aria-hidden="true">${drawerCloseIcon}</span></button>`;

const drawerWith = (props: Record<string, unknown> = {}, slots: Record<string, string> = {}) =>
  mount(PlinthDrawer, {
    props: { id: 'route', title: 'Route', ...props },
    slots: { default: '<p>Body</p>', ...slots },
  });

describe('PlinthDrawer', () => {
  it('prints the dialog, the panel with its handle, the header, the body and the footer', () => {
    const wrapper = drawerWith(
      {
        description: '12 min by bike.',
        snapPoints: ['peek', 'half', 'full'],
        snap: 'peek',
      },
      { footer: '<button type="button">Start</button>' },
    );
    const html = wrapper
      .html()
      .replace(/\n\s*/g, '')
      .replace(/<!--.*?-->/g, '');

    expect(html).toBe(
      '<dialog id="route" class="plinth-drawer" data-desktop="dialog" data-snap-points="peek half full" data-snap="peek" closedby="any" aria-labelledby="route-title" aria-describedby="route-description">' +
        '<div class="plinth-drawer-panel">' +
        '<div class="plinth-drawer-handle" aria-hidden="true"></div>' +
        '<div class="plinth-drawer-header">' +
        '<h2 id="route-title" class="plinth-drawer-title">Route</h2>' +
        '<p id="route-description" class="plinth-drawer-description">12 min by bike.</p>' +
        close +
        '</div>' +
        '<div class="plinth-drawer-body"><p>Body</p></div>' +
        '<div class="plinth-drawer-footer"><button type="button">Start</button></div>' +
        '</div>' +
        '</dialog>',
    );
  });

  it('has no snap points, no description and no footer unless it is given them', () => {
    const wrapper = drawerWith({ description: ' ' });

    expect(wrapper.attributes('data-snap-points')).toBeUndefined();
    expect(wrapper.attributes('data-snap')).toBeUndefined();
    expect(wrapper.attributes('aria-describedby')).toBeUndefined();
    expect(wrapper.find('.plinth-drawer-description').exists()).toBe(false);
    expect(wrapper.find('.plinth-drawer-footer').exists()).toBe(false);
    expect(drawerWith({}, { footer: ' ' }).find('.plinth-drawer-footer').exists()).toBe(false);
  });

  it('takes a presentation from 768px up, and falls back to dialog', () => {
    const desktop = (value?: string) => drawerWith({ desktop: value }).attributes('data-desktop');

    expect(desktop('sheet')).toBe('sheet');
    expect(desktop('dialog')).toBe('dialog');
    expect(desktop('side')).toBe('dialog');
    expect(desktop()).toBe('dialog');
    expect(drawerDesktop(undefined)).toBe('dialog');
  });

  it('takes its snap points as a list or a string: the known ones, once, smallest first', () => {
    const points = (value: unknown) => drawerWith({ snapPoints: value }).attributes();

    expect(points('full  peek')).toMatchObject({
      'data-snap-points': 'peek full',
      'data-snap': 'full',
    });
    expect(points(['half', 'top', 'half'])).toMatchObject({
      'data-snap-points': 'half',
      'data-snap': 'half',
    });
    expect(points('top')['data-snap-points']).toBeUndefined();
    expect(drawerSnapPoints(undefined)).toEqual([]);
  });

  it('opens at the snap point it is given when it is listed, else at the largest', () => {
    const snap = (value: string) =>
      drawerWith({ snapPoints: 'peek half', snap: value }).attributes('data-snap');

    expect(snap('peek')).toBe('peek');
    expect(snap('full')).toBe('half');
    expect(snap('top')).toBe('half');
    expect(drawerSnap('peek', [])).toBeUndefined();
  });

  it("takes the close button's label, and generates an id when it has none", () => {
    const wrapper = mount(PlinthDrawer, { props: { title: 'Rota', closeLabel: 'Fechar' } });
    const id = wrapper.attributes('id')!;

    expect(id).toMatch(/^plinth-drawer-/);
    expect(wrapper.attributes('aria-labelledby')).toBe(`${id}-title`);
    expect(wrapper.find('h2').attributes('id')).toBe(`${id}-title`);
    expect(wrapper.find('.plinth-drawer-close').attributes('aria-label')).toBe('Fechar');
    expect(wrapper.find('.plinth-drawer-close').attributes('commandfor')).toBe(id);
  });

  it('trims the id it is given', () => {
    expect(drawerWith({ id: ' route ' }).attributes('id')).toBe('route');
  });

  it('escapes the title and the description', () => {
    const wrapper = drawerWith({ title: '<b>x</b>', description: '<i>y</i>' });

    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.find('i').exists()).toBe(false);
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;i&gt;y&lt;/i&gt;');
  });

  it('passes extra attributes to its root, and lets a project replace closedby', () => {
    const wrapper = mount(PlinthDrawer, {
      props: { id: 'route', title: 'Route' },
      attrs: { class: 'is-busy', closedby: 'closerequest', 'data-testid': 'route' },
    });

    expect(wrapper.classes()).toEqual(['plinth-drawer', 'is-busy']);
    expect(wrapper.attributes('closedby')).toBe('closerequest');
    expect(wrapper.attributes('data-testid')).toBe('route');
  });

  it('leaves out a footer slot with only a comment in it', () => {
    const wrapper = mount(PlinthDrawer, {
      props: { id: 'route', title: 'Route' },
      slots: { footer: () => [h(Comment)] },
    });

    expect(wrapper.find('.plinth-drawer-footer').exists()).toBe(false);
  });

  it('emits close when the dialog closes', async () => {
    const wrapper = drawerWith();

    await wrapper.trigger('close');

    expect(wrapper.emitted('close')).toHaveLength(1);
  });

  it('needs a title', () => {
    expect(() => mount(PlinthDrawer, { props: { title: ' ' } })).toThrow('needs a title');
  });

  it('opens and closes the dialog through showModal() and close()', () => {
    const wrapper = drawerWith();
    const dialog = wrapper.element as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();

    wrapper.vm.showModal();
    wrapper.vm.close();

    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(dialog.close).toHaveBeenCalledOnce();
  });
});
