import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { PlinthPillRow } from '../src/index.ts';

describe('PlinthPillRow', () => {
  it('prints a named group with its pills', () => {
    const wrapper = mount(PlinthPillRow, {
      props: { label: 'Status' },
      slots: { default: '<i>pills</i>' },
    });

    expect(wrapper.html()).toBe(
      '<div class="plinth-pill-row" role="group" aria-label="Status"><i>pills</i></div>',
    );
  });

  it('leaves out an empty label', () => {
    expect(mount(PlinthPillRow).attributes()).toEqual({ class: 'plinth-pill-row', role: 'group' });
    expect(mount(PlinthPillRow, { props: { label: '' } }).attributes('aria-label')).toBeUndefined();
  });

  it('is a nav with nav', () => {
    const wrapper = mount(PlinthPillRow, { props: { label: 'Sections', nav: true } });

    expect(wrapper.element.tagName).toBe('NAV');
    expect(wrapper.attributes()).toEqual({ class: 'plinth-pill-row', 'aria-label': 'Sections' });
  });

  it('passes extra attributes to its root', () => {
    const wrapper = mount(PlinthPillRow, {
      attrs: { class: 'mb-4', 'aria-labelledby': 'status-title' },
    });

    expect(wrapper.classes()).toEqual(['plinth-pill-row', 'mb-4']);
    expect(wrapper.attributes('aria-labelledby')).toBe('status-title');
  });
});
