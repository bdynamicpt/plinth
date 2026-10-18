import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { iconSizes, PlinthIcon } from '../src/index.ts';

const svg = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"></path></svg>';
const slots = { default: svg };

describe('PlinthIcon', () => {
  it('prints a decorative icon, hidden from assistive technology', () => {
    const wrapper = mount(PlinthIcon, { slots });

    expect(wrapper.html()).toBe(
      `<span class="plinth-icon" data-size="md" aria-hidden="true">${svg}</span>`,
    );
  });

  it('prints a meaningful icon with a label', () => {
    const wrapper = mount(PlinthIcon, { props: { label: 'Warning' }, slots });

    expect(wrapper.attributes()).toMatchObject({ role: 'img', 'aria-label': 'Warning' });
    expect(wrapper.attributes('aria-hidden')).toBeUndefined();
  });

  it('takes an aria-label attribute as its label', () => {
    const wrapper = mount(PlinthIcon, { attrs: { 'aria-label': 'Warning' }, slots });

    expect(wrapper.html()).toBe(
      `<span class="plinth-icon" data-size="md" role="img" aria-label="Warning">${svg}</span>`,
    );
  });

  it('stays decorative with a blank label', () => {
    const wrapper = mount(PlinthIcon, { props: { label: '  ' }, slots });

    expect(wrapper.attributes('aria-hidden')).toBe('true');
    expect(wrapper.attributes('role')).toBeUndefined();
  });

  it.each(iconSizes)('takes the %s size', (size) => {
    expect(mount(PlinthIcon, { props: { size }, slots }).attributes('data-size')).toBe(size);
  });

  it('falls back to md for a size it does not know', () => {
    // @ts-expect-error: an unknown size, as a project might pass from untyped data.
    const wrapper = mount(PlinthIcon, { props: { size: 'huge' }, slots });

    expect(wrapper.attributes('data-size')).toBe('md');
  });

  it('marks an icon to mirror in right-to-left text', () => {
    expect(mount(PlinthIcon, { props: { mirror: true }, slots }).attributes('data-mirror')).toBe(
      '',
    );
    expect(mount(PlinthIcon, { slots }).attributes('data-mirror')).toBeUndefined();
  });

  it('escapes the label', () => {
    const wrapper = mount(PlinthIcon, { props: { label: '"><b>x</b>' }, slots });

    expect(wrapper.html()).toContain('aria-label="&quot;><b>x</b>"');
    expect(wrapper.find('b').exists()).toBe(false);
  });

  it('keeps extra classes and attributes', () => {
    const wrapper = mount(PlinthIcon, { attrs: { class: 'ms-2', id: 'extra' }, slots });

    expect(wrapper.classes()).toEqual(['plinth-icon', 'ms-2']);
    expect(wrapper.attributes('id')).toBe('extra');
  });
});
