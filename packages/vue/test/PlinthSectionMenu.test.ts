import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { PlinthSectionMenu } from '../src/index.ts';

describe('PlinthSectionMenu', () => {
  it('prints a named nav with its items', () => {
    const wrapper = mount(PlinthSectionMenu, {
      props: { label: 'Project' },
      slots: { default: '<i>items</i>' },
    });

    expect(wrapper.html()).toBe(
      '<nav class="plinth-section-menu" aria-label="Project"><i>items</i></nav>',
    );
  });

  it('leaves out an empty label', () => {
    expect(mount(PlinthSectionMenu).attributes()).toEqual({ class: 'plinth-section-menu' });
    expect(
      mount(PlinthSectionMenu, { props: { label: '' } }).attributes('aria-label'),
    ).toBeUndefined();
  });

  it('is a group without nav', () => {
    const wrapper = mount(PlinthSectionMenu, { props: { label: 'View', nav: false } });

    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.attributes()).toEqual({
      class: 'plinth-section-menu',
      role: 'group',
      'aria-label': 'View',
    });
  });

  it('escapes the label', () => {
    const wrapper = mount(PlinthSectionMenu, { props: { label: '"><b>x</b>' } });

    expect(wrapper.html()).toContain('aria-label="&quot;>');
    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.attributes('aria-label')).toBe('"><b>x</b>');
  });

  it('passes extra attributes to its root', () => {
    const wrapper = mount(PlinthSectionMenu, {
      attrs: { class: 'sticky', 'aria-labelledby': 'project-title' },
    });

    expect(wrapper.classes()).toEqual(['plinth-section-menu', 'sticky']);
    expect(wrapper.attributes('aria-labelledby')).toBe('project-title');
  });
});
