import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { describe, expect, it } from 'vitest';
import { PlinthHeader } from '../src/index.ts';

describe('PlinthHeader', () => {
  it('prints the header, the leading action, the title and the actions', () => {
    const wrapper = mount(PlinthHeader, {
      props: { title: 'Inbox' },
      slots: {
        leading: '<a href="/">Back</a>',
        actions: '<button type="button">Search</button>',
      },
    });

    expect(wrapper.html().replace(/\n\s*/g, '')).toBe(
      '<header class="plinth-header">' +
        '<div class="plinth-header-leading"><a href="/">Back</a></div>' +
        '<h1 class="plinth-header-title">Inbox</h1>' +
        '<div class="plinth-header-actions"><button type="button">Search</button></div>' +
        '</header>',
    );
  });

  it('prints only the title without a leading action or actions', () => {
    const wrapper = mount(PlinthHeader, { props: { title: 'Settings' } });

    expect(wrapper.html().replace(/\n\s*|<!--v-if-->/g, '')).toBe(
      '<header class="plinth-header"><h1 class="plinth-header-title">Settings</h1></header>',
    );
  });

  it('leaves out slots that render nothing', () => {
    const wrapper = mount(PlinthHeader, {
      props: { title: 'Settings' },
      slots: { leading: () => '  ', actions: () => [] },
    });

    expect(wrapper.find('.plinth-header-leading').exists()).toBe(false);
    expect(wrapper.find('.plinth-header-actions').exists()).toBe(false);
  });

  it('needs a title', () => {
    expect(() => mount(PlinthHeader, { props: { title: ' ' } })).toThrow('needs a title');
    expect(() => mount(PlinthHeader, { props: {} as { title: string } })).toThrow('needs a title');
  });

  it('escapes the title', () => {
    const wrapper = mount(PlinthHeader, { props: { title: '<b>x</b>' } });

    expect(wrapper.find('h1').html()).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('keeps extra classes and attributes on the root', () => {
    const wrapper = mount(PlinthHeader, {
      props: { title: 'Inbox' },
      attrs: { class: 'is-scrolled', id: 'top', 'data-testid': 'header', 'aria-label': 'Inbox' },
      slots: { actions: () => h('button', { type: 'button' }, 'Search') },
    });

    expect(wrapper.element.tagName).toBe('HEADER');
    expect(wrapper.classes()).toEqual(['plinth-header', 'is-scrolled']);
    expect(wrapper.attributes()).toMatchObject({
      id: 'top',
      'data-testid': 'header',
      'aria-label': 'Inbox',
    });
  });
});
