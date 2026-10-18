import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { PlinthPill } from '../src/index.ts';

const squish = (html: string) => html.replace(/<!--.*?-->/g, '').replace(/>\s+</g, '><');

describe('PlinthPill', () => {
  it('prints a toggle button with its label', () => {
    const wrapper = mount(PlinthPill, { slots: { default: 'Open' } });

    expect(squish(wrapper.html())).toBe(
      '<button class="plinth-pill" type="button" aria-pressed="false"><span class="plinth-pill-label">Open</span></button>',
    );
  });

  it('prints the count, zero included, and leaves out an empty one', () => {
    expect(
      mount(PlinthPill, { props: { count: 12 } })
        .get('.plinth-pill-count')
        .text(),
    ).toBe('12');
    expect(
      mount(PlinthPill, { props: { count: 0 } })
        .get('.plinth-pill-count')
        .text(),
    ).toBe('0');
    for (const count of ['', ' ', null]) {
      expect(mount(PlinthPill, { props: { count } }).find('.plinth-pill-count').exists()).toBe(
        false,
      );
    }
  });

  it('marks a selected button as pressed', () => {
    const wrapper = mount(PlinthPill, { props: { selected: true } });

    expect(wrapper.attributes('aria-pressed')).toBe('true');
    expect(wrapper.attributes('aria-current')).toBeUndefined();
  });

  it('is a link with an href, current when selected', () => {
    const link = mount(PlinthPill, { props: { href: '/tasks' } });
    expect(link.element.tagName).toBe('A');
    expect(link.attributes()).toEqual({ class: 'plinth-pill', href: '/tasks' });

    const current = mount(PlinthPill, { props: { href: '/tasks', selected: true } });
    expect(current.attributes('aria-current')).toBe('page');
    expect(current.attributes('aria-pressed')).toBeUndefined();
  });

  it('disables a button and a link', () => {
    expect(mount(PlinthPill, { props: { disabled: true } }).attributes('disabled')).toBe('');

    const link = mount(PlinthPill, { props: { href: '/reports', disabled: true } });
    expect(link.attributes()).toEqual({
      class: 'plinth-pill',
      role: 'link',
      'aria-disabled': 'true',
    });
  });

  it('escapes the label and the count', () => {
    const wrapper = mount(PlinthPill, {
      props: { count: '<b>y</b>' },
      slots: { default: () => '<b>x</b>' },
    });

    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;b&gt;y&lt;/b&gt;');
  });

  it('passes extra attributes and listeners to its root', async () => {
    let clicks = 0;
    const wrapper = mount(PlinthPill, {
      attrs: { class: 'ms-2', id: 'open', type: 'submit', onClick: () => clicks++ },
    });

    expect(wrapper.classes()).toEqual(['plinth-pill', 'ms-2']);
    expect(wrapper.attributes()).toMatchObject({ id: 'open', type: 'submit' });
    await wrapper.trigger('click');
    expect(clicks).toBe(1);
  });
});
