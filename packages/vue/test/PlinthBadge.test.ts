import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { PlinthBadge, tones } from '../src/index.ts';

describe('PlinthBadge', () => {
  it('prints the badge markup contract', () => {
    const badge = mount(PlinthBadge, {
      props: { tone: 'success', dot: true },
      slots: { default: 'Paid' },
    });

    expect(badge.html()).toBe(
      [
        '<span class="plinth-badge" data-tone="success"><span class="plinth-badge-dot" aria-hidden="true"></span><span class="plinth-badge-label">Paid</span></span>',
      ].join(''),
    );
  });

  it('is neutral and has no dot by default', () => {
    const badge = mount(PlinthBadge, { slots: { default: 'Draft' } });

    expect(badge.attributes('data-tone')).toBe('neutral');
    expect(badge.find('.plinth-badge-dot').exists()).toBe(false);
    expect(badge.get('.plinth-badge-label').text()).toBe('Draft');
  });

  it.each(tones)('accepts the %s tone', (tone) => {
    expect(mount(PlinthBadge, { props: { tone } }).attributes('data-tone')).toBe(tone);
  });

  it('falls back to neutral for a tone it does not know', () => {
    // @ts-expect-error: an unknown tone, as a project might pass from untyped data.
    const badge = mount(PlinthBadge, { props: { tone: 'purple' } });

    expect(badge.attributes('data-tone')).toBe('neutral');
  });

  it('escapes the label', () => {
    const badge = mount(PlinthBadge, { slots: { default: () => '<b>x</b>' } });

    expect(badge.html()).toContain('&lt;b&gt;x&lt;/b&gt;');
  });

  it('keeps extra classes and attributes', () => {
    const badge = mount(PlinthBadge, {
      props: { tone: 'danger' },
      attrs: { class: 'ms-2', id: 'status' },
    });

    expect(badge.classes()).toEqual(['plinth-badge', 'ms-2']);
    expect(badge.attributes('id')).toBe('status');
  });
});
