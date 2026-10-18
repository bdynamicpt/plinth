import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { PlinthAvatar } from '../src/index.ts';

describe('PlinthAvatar', () => {
  it('prints the avatar markup contract', () => {
    const wrapper = mount(PlinthAvatar, { slots: { default: 'Content' } });

    expect(wrapper.html()).toBe('<div class="plinth-avatar">Content</div>');
  });

  it('escapes the content', () => {
    const wrapper = mount(PlinthAvatar, { slots: { default: () => '<b>x</b>' } });

    expect(wrapper.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('keeps extra classes and attributes', () => {
    const wrapper = mount(PlinthAvatar, { attrs: { class: 'ms-2', id: 'extra' } });

    expect(wrapper.classes()).toEqual(['plinth-avatar', 'ms-2']);
    expect(wrapper.attributes('id')).toBe('extra');
  });
});
