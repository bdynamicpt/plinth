import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { controlSizes, buttonVariants, PlinthButton } from '../src/index.ts';

const svg = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"></path></svg>';

describe('PlinthButton', () => {
  it('prints the button markup contract', () => {
    const wrapper = mount(PlinthButton, { slots: { default: 'Save' } });

    // Vue leaves comments where the optional icons would go; they are not markup.
    expect(
      wrapper
        .html()
        .replace(/<!--.*?-->/g, '')
        .replace(/>\s+</g, '><'),
    ).toBe(
      '<button type="button" class="plinth-button" data-variant="primary" data-size="md"><span class="plinth-button-label">Save</span></button>',
    );
  });

  it('prints a link when given an href', () => {
    const wrapper = mount(PlinthButton, {
      props: { href: '/orders', variant: 'secondary' },
      slots: { default: 'Orders' },
    });

    expect(wrapper.element.tagName).toBe('A');
    expect(wrapper.attributes('href')).toBe('/orders');
    expect(wrapper.attributes('type')).toBeUndefined();
  });

  it.each(buttonVariants.flatMap((variant) => controlSizes.map((size) => [variant, size])))(
    'takes the %s variant at the %s size',
    (variant, size) => {
      // @ts-expect-error: the pairs are built from the lists, so they are valid.
      const wrapper = mount(PlinthButton, { props: { variant, size } });
      expect(wrapper.attributes()).toMatchObject({ 'data-variant': variant, 'data-size': size });
    },
  );

  it('falls back to primary and md for values it does not know', () => {
    // @ts-expect-error: unknown values, as a project might pass from untyped data.
    const wrapper = mount(PlinthButton, { props: { variant: 'loud', size: 'huge' } });

    expect(wrapper.attributes()).toMatchObject({ 'data-variant': 'primary', 'data-size': 'md' });
  });

  it('prints the leading and trailing icons, sized to the button', () => {
    const wrapper = mount(PlinthButton, {
      props: { size: 'sm' },
      slots: { icon: svg, default: 'Next', trailing: svg },
    });
    const icons = wrapper.findAll('.plinth-icon');

    expect(icons).toHaveLength(2);
    expect(icons.map((icon) => icon.attributes('data-size'))).toEqual(['sm', 'sm']);
  });

  it('flips arrow icons in right-to-left text when asked', () => {
    const wrapper = mount(PlinthButton, {
      props: { mirrorTrailing: true },
      slots: { default: 'Next', trailing: svg },
    });

    expect(wrapper.get('.plinth-icon').attributes('data-mirror')).toBe('');
  });

  it('disables a button with disabled, and a link with aria-disabled and no href', () => {
    expect(mount(PlinthButton, { props: { disabled: true } }).attributes('disabled')).toBe('');

    const link = mount(PlinthButton, { props: { href: '/orders', disabled: true } });
    expect(link.attributes()).toMatchObject({ role: 'link', 'aria-disabled': 'true' });
    expect(link.attributes('href')).toBeUndefined();
  });

  it('shows a spinner and stays focusable while busy', () => {
    const wrapper = mount(PlinthButton, { props: { busy: true }, slots: { icon: svg } });

    expect(wrapper.attributes()).toMatchObject({ 'aria-busy': 'true', 'aria-disabled': 'true' });
    expect(wrapper.attributes('disabled')).toBeUndefined();
    expect(wrapper.find('.plinth-button-spinner').exists()).toBe(true);
    expect(wrapper.find('.plinth-icon').exists()).toBe(false);
  });

  it('lets disabled win over busy', () => {
    const wrapper = mount(PlinthButton, { props: { disabled: true, busy: true } });

    expect(wrapper.attributes('disabled')).toBe('');
    expect(wrapper.attributes('aria-busy')).toBeUndefined();
  });

  it('escapes the label', () => {
    const wrapper = mount(PlinthButton, { slots: { default: () => '<b>x</b>' } });

    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('passes classes, a type and listeners to its root', async () => {
    let clicks = 0;
    const wrapper = mount(PlinthButton, {
      attrs: { class: 'ms-2', type: 'submit', onClick: () => clicks++ },
    });

    expect(wrapper.classes()).toEqual(['plinth-button', 'ms-2']);
    expect(wrapper.attributes('type')).toBe('submit');
    await wrapper.trigger('click');
    expect(clicks).toBe(1);
  });

  it('prints the icons, flips them and shows busy on a link too', () => {
    const link = mount(PlinthButton, {
      props: { href: '/next', mirrorIcon: true, mirrorTrailing: true },
      slots: { default: 'Next', icon: svg, trailing: svg },
    });
    const icons = link.findAll('.plinth-icon');

    expect(icons).toHaveLength(2);
    expect(icons.map((icon) => icon.attributes('data-mirror'))).toEqual(['', '']);
    expect(icons.map((icon) => icon.attributes('data-size'))).toEqual(['md', 'md']);

    const busy = mount(PlinthButton, {
      props: { href: '/next', busy: true },
      slots: { default: 'Next', icon: svg },
    });

    expect(busy.find('.plinth-button-spinner').exists()).toBe(true);
    expect(busy.find('.plinth-icon').exists()).toBe(false);
    expect(busy.attributes()).toMatchObject({ 'aria-busy': 'true', 'aria-disabled': 'true' });
    expect(busy.attributes('href')).toBe('/next');
  });

  it('flips the leading icon on a button without flipping the trailing one', () => {
    const wrapper = mount(PlinthButton, {
      props: { mirrorIcon: true },
      slots: { default: 'Back', icon: svg, trailing: svg },
    });

    expect(wrapper.findAll('.plinth-icon').map((icon) => icon.attributes('data-mirror'))).toEqual([
      '',
      undefined,
    ]);
  });

  it('leaves the icons on a link unflipped unless asked', () => {
    const wrapper = mount(PlinthButton, {
      props: { href: '/next' },
      slots: { default: 'Next', icon: svg, trailing: svg },
    });

    expect(wrapper.findAll('.plinth-icon').map((icon) => icon.attributes('data-mirror'))).toEqual([
      undefined,
      undefined,
    ]);
  });
});
