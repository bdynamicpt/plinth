import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { headingLevel, PlinthListCard } from '../src/index.ts';

const rows = '<li><div class="plinth-list-row">Email</div></li>';

describe('PlinthListCard', () => {
  it('prints the heading, the rows and the footer', () => {
    const wrapper = mount(PlinthListCard, {
      props: { heading: 'Account', footer: 'On this device only.' },
      slots: { default: rows },
    });

    expect(wrapper.html().replace(/\n\s*/g, '')).toBe(
      '<div class="plinth-list-card"><h2 class="plinth-list-card-heading">Account</h2>' +
        `<ul class="plinth-list-card-list" role="list">${rows}</ul>` +
        '<p class="plinth-list-card-footer">On this device only.</p></div>',
    );
  });

  it('leaves out an empty heading and footer', () => {
    const wrapper = mount(PlinthListCard, { props: { heading: '', footer: '' } });

    expect(wrapper.html().replace(/\n\s*/g, '')).toBe(
      '<div class="plinth-list-card"><!--v-if--><ul class="plinth-list-card-list" role="list"></ul><!--v-if--></div>',
    );
  });

  it('takes a heading level, and falls back to h2', () => {
    const level = (value: string) =>
      mount(PlinthListCard, {
        props: { heading: 'Display', headingLevel: value as 'h3' },
      }).find('.plinth-list-card-heading').element.tagName;

    expect(level('h3')).toBe('H3');
    expect(level('h6')).toBe('H6');
    expect(level('h1')).toBe('H2');
    expect(headingLevel(undefined)).toBe('h2');
  });

  it('escapes the heading and the footer', () => {
    const wrapper = mount(PlinthListCard, { props: { heading: '<b>x</b>', footer: '<i>y</i>' } });

    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.find('i').exists()).toBe(false);
    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
    expect(wrapper.html()).toContain('&lt;i&gt;y&lt;/i&gt;');
  });

  it('passes extra attributes to its root', () => {
    const wrapper = mount(PlinthListCard, {
      attrs: { class: 'mb-4', id: 'account', 'data-testid': 'account' },
    });

    expect(wrapper.classes()).toEqual(['plinth-list-card', 'mb-4']);
    expect(wrapper.attributes('id')).toBe('account');
    expect(wrapper.attributes('data-testid')).toBe('account');
  });
});
