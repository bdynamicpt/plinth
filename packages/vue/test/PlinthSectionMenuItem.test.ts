import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { PlinthSectionMenuItem } from '../src/index.ts';

const squish = (html: string) => html.replace(/<!--.*?-->/g, '').replace(/>\s+</g, '><');

describe('PlinthSectionMenuItem', () => {
  it('prints a toggle button with its label', () => {
    const wrapper = mount(PlinthSectionMenuItem, { slots: { default: 'Open' } });

    expect(squish(wrapper.html())).toBe(
      '<button class="plinth-section-menu-item" type="button" aria-pressed="false"><span class="plinth-section-menu-label">Open</span></button>',
    );
  });

  it('prints the count, zero included, and leaves out an empty one', () => {
    expect(
      mount(PlinthSectionMenuItem, { props: { count: 12 } })
        .get('.plinth-section-menu-count')
        .text(),
    ).toBe('12');
    expect(
      mount(PlinthSectionMenuItem, { props: { count: 0 } })
        .get('.plinth-section-menu-count')
        .text(),
    ).toBe('0');
    for (const count of ['', ' ', null]) {
      expect(
        mount(PlinthSectionMenuItem, { props: { count } })
          .find('.plinth-section-menu-count')
          .exists(),
      ).toBe(false);
    }
  });

  it('marks the current button as pressed', () => {
    const wrapper = mount(PlinthSectionMenuItem, { props: { current: true } });

    expect(wrapper.attributes('aria-pressed')).toBe('true');
    expect(wrapper.attributes('aria-current')).toBeUndefined();
  });

  it('is a link with an href, marked current when current', () => {
    const link = mount(PlinthSectionMenuItem, { props: { href: '/tasks' } });
    expect(link.element.tagName).toBe('A');
    expect(link.attributes()).toEqual({ class: 'plinth-section-menu-item', href: '/tasks' });

    const current = mount(PlinthSectionMenuItem, { props: { href: '/tasks', current: true } });
    expect(current.attributes('aria-current')).toBe('page');
    expect(current.attributes('aria-pressed')).toBeUndefined();
  });

  it('is a button with a blank href', () => {
    expect(mount(PlinthSectionMenuItem, { props: { href: ' ' } }).element.tagName).toBe('BUTTON');
  });

  it('disables a button and a link', () => {
    expect(mount(PlinthSectionMenuItem, { props: { disabled: true } }).attributes('disabled')).toBe(
      '',
    );

    const link = mount(PlinthSectionMenuItem, { props: { href: '/reports', disabled: true } });
    expect(link.attributes()).toEqual({
      class: 'plinth-section-menu-item',
      role: 'link',
      'aria-disabled': 'true',
    });
  });

  it('escapes the label and the count', () => {
    const wrapper = mount(PlinthSectionMenuItem, {
      props: { count: '<b>y</b>' },
      slots: { default: () => '<b>x</b>' },
    });

    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;b&gt;y&lt;/b&gt;');
  });

  it('passes extra attributes and listeners to its root', async () => {
    let clicks = 0;
    const wrapper = mount(PlinthSectionMenuItem, {
      attrs: { class: 'ms-2', id: 'open', type: 'submit', onClick: () => clicks++ },
    });

    expect(wrapper.classes()).toEqual(['plinth-section-menu-item', 'ms-2']);
    expect(wrapper.attributes()).toMatchObject({ id: 'open', type: 'submit' });
    await wrapper.trigger('click');
    expect(clicks).toBe(1);
  });
});
