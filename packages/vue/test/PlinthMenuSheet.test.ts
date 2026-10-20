import { mount } from '@vue/test-utils';
import { Comment, h } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import { PlinthMenuSheet } from '../src/index.ts';

const menuWith = (props: Record<string, unknown> = {}, slots: Record<string, unknown> = {}) =>
  mount(PlinthMenuSheet, {
    props: { id: 'menu', ...props },
    slots: { default: '<a href="/inbox">Inbox</a>', ...slots } as never,
  });

const body = (html: string) => html.replace(/\n\s*/g, '').replace(/<!--.*?-->/g, '');

describe('PlinthMenuSheet', () => {
  it('prints a sheet with the user, the nav and the account', () => {
    const wrapper = menuWith(
      { userName: 'Sam Lee', userDetail: 'sam@example.com', userHref: '/profile' },
      { account: '<button type="button">Sign out</button>' },
    );
    const html = body(wrapper.html());

    expect(html).toMatch(
      /^<dialog id="menu" class="plinth-sheet plinth-menu-sheet" data-side="end" data-side-phone="bottom" closedby="any" aria-labelledby="menu-title">/,
    );
    expect(wrapper.find('h2').text()).toBe('Menu');
    expect(wrapper.find('.plinth-sheet-close').attributes('aria-label')).toBe('Close');
    expect(wrapper.find('.plinth-sheet-footer').exists()).toBe(false);
    expect(html).toContain(
      '<div class="plinth-sheet-body">' +
        '<a class="plinth-list-row plinth-menu-sheet-user" href="/profile">' +
        '<span class="plinth-list-row-leading"><span class="plinth-avatar" data-size="lg" aria-hidden="true">' +
        '<span class="plinth-avatar-initials" aria-hidden="true">SL</span></span></span>' +
        '<span class="plinth-list-row-content"><span class="plinth-list-row-title">Sam Lee</span>' +
        '<span class="plinth-list-row-description">sam@example.com</span></span>' +
        '<span class="plinth-list-row-trailing">',
    );
    expect(wrapper.find('.plinth-menu-sheet-user .plinth-list-row-chevron').exists()).toBe(true);
    expect(html).toContain(
      '<nav class="plinth-menu-sheet-nav" aria-labelledby="menu-title"><a href="/inbox">Inbox</a></nav>' +
        '<div class="plinth-menu-sheet-account"><button type="button">Sign out</button></div>' +
        '</div></div></dialog>',
    );
  });

  it('prints a static user row with no chevron when it has no href', () => {
    for (const userHref of [undefined, ' ']) {
      const wrapper = menuWith({ userName: 'Sam Lee', userHref });
      const user = wrapper.find('.plinth-menu-sheet-user');

      expect(user.element.tagName).toBe('DIV');
      expect(user.find('.plinth-list-row-chevron').exists()).toBe(false);
      expect(user.find('.plinth-list-row-description').exists()).toBe(false);
    }
  });

  it('ignores a blank picture', () => {
    const wrapper = menuWith({ userName: 'Sam Lee', userSrc: ' ' });

    expect(wrapper.find('.plinth-avatar-image').exists()).toBe(false);
    expect(wrapper.find('.plinth-avatar-initials').text()).toBe('SL');
  });

  it("shows the user's picture", () => {
    const wrapper = menuWith({ userName: 'Sam Lee', userSrc: '/sam.jpg' });

    expect(wrapper.find('.plinth-avatar-image').attributes('src')).toBe('/sam.jpg');
    expect(wrapper.find('.plinth-avatar-initials').exists()).toBe(false);
  });

  it('leaves out the user row without a name, and a blank detail and account', () => {
    for (const userName of [undefined, ' ']) {
      const wrapper = menuWith({ userName, userDetail: ' ' }, { account: () => [h(Comment)] });

      expect(wrapper.find('.plinth-menu-sheet-user').exists()).toBe(false);
      expect(wrapper.find('.plinth-menu-sheet-account').exists()).toBe(false);
    }

    const blankDetail = menuWith({ userName: 'Sam Lee', userDetail: ' ' });
    expect(blankDetail.find('.plinth-list-row-description').exists()).toBe(false);
  });

  it("takes the title and the close button's label", () => {
    const wrapper = menuWith({ title: 'Navegação', closeLabel: 'Fechar' });

    expect(wrapper.find('h2').text()).toBe('Navegação');
    expect(wrapper.find('.plinth-sheet-close').attributes('aria-label')).toBe('Fechar');
  });

  it('generates an id when it has none, and wires the title and the nav to it', () => {
    const wrapper = mount(PlinthMenuSheet, { slots: { default: 'Inbox' } });
    const id = wrapper.attributes('id')!;

    expect(id).toMatch(/^plinth-menu-sheet-/);
    expect(wrapper.find('h2').attributes('id')).toBe(`${id}-title`);
    expect(wrapper.find('nav').attributes('aria-labelledby')).toBe(`${id}-title`);
    expect(wrapper.find('.plinth-sheet-close').attributes('commandfor')).toBe(id);
  });

  it('trims the id it is given', () => {
    const wrapper = menuWith({ id: ' menu ' });

    expect(wrapper.attributes('id')).toBe('menu');
    expect(wrapper.find('nav').attributes('aria-labelledby')).toBe('menu-title');
  });

  it("escapes the user's name and detail, and the id", () => {
    const wrapper = menuWith({ id: 'a"b', userName: '<b>Sam</b>', userDetail: '<i>x</i>' });

    expect(wrapper.html()).toContain('aria-labelledby="a&quot;b-title"');

    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.find('i').exists()).toBe(false);
    expect(wrapper.html()).toContain('&lt;b&gt;Sam&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;i&gt;x&lt;/i&gt;');
  });

  it('passes extra attributes to the dialog', () => {
    const wrapper = mount(PlinthMenuSheet, {
      props: { id: 'menu' },
      attrs: { class: 'is-shell', closedby: 'closerequest', 'data-testid': 'menu' },
    });

    expect(wrapper.classes()).toEqual(['plinth-sheet', 'plinth-menu-sheet', 'is-shell']);
    expect(wrapper.attributes('closedby')).toBe('closerequest');
    expect(wrapper.attributes('data-testid')).toBe('menu');
  });

  it('emits close when the dialog closes', async () => {
    const wrapper = menuWith();

    await wrapper.trigger('close');

    expect(wrapper.emitted('close')).toHaveLength(1);
    expect(wrapper.emitted('close')![0]![0]).toBeInstanceOf(Event);
  });

  it('opens and closes the dialog through showModal() and close()', () => {
    const wrapper = menuWith();
    const dialog = wrapper.element as HTMLDialogElement;
    dialog.showModal = vi.fn();
    dialog.close = vi.fn();

    wrapper.vm.showModal();
    wrapper.vm.close();

    expect(dialog.showModal).toHaveBeenCalledOnce();
    expect(dialog.close).toHaveBeenCalledOnce();
  });
});
