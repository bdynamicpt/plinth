import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { h } from 'vue';
import { PlinthCallout, calloutIcons, calloutRoles, calloutTones } from '../src/index.ts';

const icon = (tone: keyof typeof calloutIcons) =>
  `<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">${calloutIcons[tone]}</span>`;

describe('PlinthCallout', () => {
  it('prints the callout markup contract', () => {
    const callout = mount(PlinthCallout, {
      props: { tone: 'warning', title: 'Your trial ends in 3 days' },
      slots: {
        default: 'Add a payment method.',
        actions: '<button type="button">Add</button>',
      },
    });

    expect(callout.html().replace(/>\s+</g, '><')).toBe(
      [
        '<div class="plinth-callout" data-tone="warning" role="note">',
        icon('warning'),
        '<div class="plinth-callout-body">',
        '<p class="plinth-callout-title">Your trial ends in 3 days</p>',
        '<div class="plinth-callout-text">Add a payment method.</div>',
        '<div class="plinth-callout-actions"><button type="button">Add</button></div>',
        '</div></div>',
      ].join(''),
    );
  });

  it('is a neutral note with only the text by default', () => {
    const callout = mount(PlinthCallout, { slots: { default: 'Drafts are private.' } });

    expect(callout.attributes('data-tone')).toBe('neutral');
    expect(callout.attributes('role')).toBe('note');
    expect(callout.get('.plinth-callout-icon').html()).toBe(icon('neutral'));
    expect(callout.find('.plinth-callout-title').exists()).toBe(false);
    expect(callout.find('.plinth-callout-actions').exists()).toBe(false);
    expect(callout.get('.plinth-callout-text').text()).toBe('Drafts are private.');
  });

  it.each(calloutTones)('prints the %s tone with its icon', (tone) => {
    const callout = mount(PlinthCallout, { props: { tone } });

    expect(callout.attributes('data-tone')).toBe(tone);
    expect(callout.get('.plinth-callout-icon').html()).toBe(icon(tone));
  });

  it.each(calloutRoles)('takes the %s role', (role) => {
    expect(mount(PlinthCallout, { props: { role } }).attributes('role')).toBe(role);
  });

  it('falls back to a neutral note for a tone or role it does not know', () => {
    // @ts-expect-error: unknown values, as a project might pass from untyped data.
    const callout = mount(PlinthCallout, { props: { tone: 'loud', role: 'log' } });

    expect(callout.attributes('data-tone')).toBe('neutral');
    expect(callout.attributes('role')).toBe('note');
  });

  it('leaves out a blank title, text and actions', () => {
    const callout = mount(PlinthCallout, {
      props: { title: '  ' },
      slots: { default: ' ', actions: () => [] },
    });

    expect(callout.get('.plinth-callout-body').element.children).toHaveLength(0);
  });

  it('takes the title as a slot with markup', () => {
    const callout = mount(PlinthCallout, {
      slots: { title: () => ['Read ', h('code', 'brand.css')] },
    });

    expect(callout.get('.plinth-callout-title').html()).toBe(
      '<p class="plinth-callout-title">Read <code>brand.css</code></p>',
    );
  });

  it('puts a project’s icon in place of the tone’s', () => {
    const callout = mount(PlinthCallout, {
      props: { tone: 'info' },
      slots: { icon: '<svg id="bell"></svg>' },
    });

    expect(callout.get('.plinth-callout-icon').html()).toBe(
      '<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true"><svg id="bell"></svg></span>',
    );
  });

  it('escapes the title and the text', () => {
    const callout = mount(PlinthCallout, {
      props: { title: '<b>t</b>' },
      slots: { default: () => '<i>x</i>' },
    });

    expect(callout.html()).toContain('&lt;b&gt;t&lt;/b&gt;');
    expect(callout.html()).toContain('&lt;i&gt;x&lt;/i&gt;');
  });

  it('keeps extra classes and attributes', () => {
    const callout = mount(PlinthCallout, {
      attrs: { class: 'mb-4', id: 'trial', 'aria-labelledby': 'trial-title' },
    });

    expect(callout.classes()).toEqual(['plinth-callout', 'mb-4']);
    expect(callout.attributes('id')).toBe('trial');
    expect(callout.attributes('aria-labelledby')).toBe('trial-title');
  });
});
