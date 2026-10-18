import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  avatarSizes,
  initialsFrom,
  PlinthAvatar,
  type AvatarSize,
  type Tone,
} from '../src/index.ts';

describe('PlinthAvatar', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('prints initials with the name as the accessible name', () => {
    const wrapper = mount(PlinthAvatar, { props: { name: 'Ana Lima' } });

    expect(
      wrapper
        .html()
        .replace(/<!--.*?-->/g, '')
        .replace(/>\s+</g, '><'),
    ).toBe(
      '<span class="plinth-avatar" data-size="md" role="img" aria-label="Ana Lima"><span class="plinth-avatar-initials" aria-hidden="true">AL</span></span>',
    );
  });

  it('prints an image when there is one', () => {
    const wrapper = mount(PlinthAvatar, { props: { name: 'Ana Lima', src: '/ana.jpg' } });

    expect(wrapper.get('img').attributes()).toMatchObject({ src: '/ana.jpg', alt: '' });
    expect(wrapper.find('.plinth-avatar-initials').exists()).toBe(false);
  });

  it.each([
    ['Ana Lima', 'AL'],
    ['Ana Maria de Lima', 'AL'],
    ['Zé', 'Z'],
    ['  élio   ramos ', 'ÉR'],
    ['', ''],
  ])('takes initials from %j', (name, initials) => {
    expect(initialsFrom(name)).toBe(initials);
  });

  it('prefers given initials, and shows the glyph when there are none', () => {
    expect(mount(PlinthAvatar, { props: { name: 'Plinth Design', initials: 'PD' } }).text()).toBe(
      'PD',
    );
    expect(
      mount(PlinthAvatar, { props: { decorative: true } })
        .find('.plinth-avatar-glyph')
        .exists(),
    ).toBe(true);
  });

  it('is hidden from assistive technology when decorative', () => {
    const wrapper = mount(PlinthAvatar, { props: { name: 'Ana Lima', decorative: true } });

    expect(wrapper.attributes('aria-hidden')).toBe('true');
    expect(wrapper.attributes('role')).toBeUndefined();
  });

  it('adds the status dot, and its label to the name', () => {
    const wrapper = mount(PlinthAvatar, {
      props: { name: 'Ana Lima', status: 'success', statusLabel: 'Online' },
    });

    expect(wrapper.attributes('aria-label')).toBe('Ana Lima, Online');
    expect(wrapper.get('.plinth-avatar-status').attributes('data-tone')).toBe('success');
  });

  it.each(avatarSizes)('takes the %s size', (size) => {
    expect(mount(PlinthAvatar, { props: { name: 'Ana Lima', size } }).attributes('data-size')).toBe(
      size,
    );
  });

  it('falls back to md for a size it does not support', () => {
    // xs is on the shared scale but not an avatar size, as untyped data might pass it.
    const size = 'xs' as AvatarSize;
    expect(mount(PlinthAvatar, { props: { name: 'Ana Lima', size } }).attributes('data-size')).toBe(
      'md',
    );
  });

  it('escapes the name', () => {
    const wrapper = mount(PlinthAvatar, { props: { name: '"><b>x</b>' } });

    expect(wrapper.find('b').exists()).toBe(false);
    expect(wrapper.attributes('aria-label')).toBe('"><b>x</b>');
  });

  it.each(['neutral', 'success', 'warning', 'danger'] as const)('takes the %s tone', (status) => {
    const wrapper = mount(PlinthAvatar, { props: { name: 'Ana', status, statusLabel: 'x' } });
    expect(wrapper.get('.plinth-avatar-status').attributes('data-tone')).toBe(status);
  });

  it('falls back to neutral, and treats an empty status as none', () => {
    // An unknown and an empty tone, as untyped data might pass them.
    const unknown = mount(PlinthAvatar, {
      props: { name: 'Ana', status: 'purple' as Tone, statusLabel: 'x' },
    });
    expect(unknown.get('.plinth-avatar-status').attributes('data-tone')).toBe('neutral');
    const empty = mount(PlinthAvatar, { props: { name: 'Ana', status: '' as Tone } });
    expect(empty.find('.plinth-avatar-status').exists()).toBe(false);
  });

  it('warns without a name, or with a status but no label, unless decorative', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    mount(PlinthAvatar);
    mount(PlinthAvatar, { props: { name: 'Ana', status: 'success' } });
    mount(PlinthAvatar, { props: { decorative: true, status: 'success' } });

    const messages = warn.mock.calls.map((call) => String(call[0]));
    expect(messages.filter((m) => m.includes('needs a name'))).toHaveLength(1);
    expect(messages.filter((m) => m.includes('needs a statusLabel'))).toHaveLength(1);
  });

  it('passes extra attributes to its root', () => {
    const wrapper = mount(PlinthAvatar, {
      props: { name: 'Ana Lima' },
      attrs: { class: 'ms-2', id: 'me' },
    });

    expect(wrapper.classes()).toEqual(['plinth-avatar', 'ms-2']);
    expect(wrapper.attributes('id')).toBe('me');
  });
});
