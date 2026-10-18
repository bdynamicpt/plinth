import { PlinthBadge, PlinthButton, PlinthIcon } from '@bdynamic/plinth-vue';
import { createStaticVNode, h, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import * as badgeStories from '../stories/components/Badge.stories.ts';
import { badge, type Attributes, type BadgeArgs } from '../stories/components/badge.ts';
import * as buttonStories from '../stories/components/Button.stories.ts';
import { button, type ButtonArgs } from '../stories/components/button.ts';
import * as iconStories from '../stories/components/Icon.stories.ts';
import { icon, type IconArgs } from '../stories/components/icon.ts';
import { sampleIcons } from '../stories/components/icons.ts';
import { normalize, renderBlade } from './markup.ts';

/**
 * Parity: for every story of a component, the Blade and the Vue output must match the story's
 * markup (ignoring whitespace and attribute order). If a layer drifts from the contract, this
 * fails. Stories with their own render (galleries such as AllTones) are not single cases.
 *
 * Each component also has a case with extra attributes, as a project adds them (a class, an id,
 * data-* and aria-*), so attribute forwarding cannot drift between Blade and Vue either.
 */
interface ParityCase {
  story: string;
  markup: string;
  /** `html: true` when the slot is markup (an icon's SVG) rather than text. */
  vue: {
    component: Component;
    props: Record<string, unknown>;
    slot: string;
    html?: boolean;
    /** Named slots, as markup. */
    named?: Record<string, string>;
  };
  blade: {
    component: string;
    props: Record<string, unknown>;
    attributes?: Attributes;
    slot: string;
    named?: Record<string, string>;
  };
}

function storyArgs<Args>(stories: Record<string, unknown>): [string, Args][] {
  const { default: meta, ...exports } = stories as {
    default: { args?: Partial<Args> };
  } & Record<string, { args?: Partial<Args>; render?: unknown }>;
  return Object.entries(exports)
    .filter(([, story]) => !story.render)
    .map(([name, story]) => [name, { ...meta.args, ...story.args } as Args]);
}

const buttonDefaults: ButtonArgs = {
  label: 'Save',
  variant: 'primary',
  size: 'md',
  disabled: false,
  busy: false,
};

const cases: ParityCase[] = [
  ...storyArgs<BadgeArgs>(badgeStories).map(([story, args]) => ({
    story: `Badge/${story}`,
    markup: badge(args),
    vue: { component: PlinthBadge, props: { tone: args.tone, dot: args.dot }, slot: args.label },
    blade: { component: 'badge', props: { tone: args.tone, dot: args.dot }, slot: args.label },
  })),
  badgeWithAttributes(),
  ...storyArgs<IconArgs>(iconStories).map(([story, args]) => iconCase(`Icon/${story}`, args)),
  iconCase(
    'Icon/with extra attributes',
    { size: 'lg', label: 'Done', mirror: false, svg: sampleIcons.check },
    { class: 'ms-2', id: 'saved-icon', 'data-testid': 'saved-icon', title: 'Saved' },
  ),
  ...storyArgs<ButtonArgs>(buttonStories).map(([story, args]) =>
    buttonCase(`Button/${story}`, args),
  ),
  buttonCase(
    'Button/with extra attributes',
    { label: 'Save', variant: 'primary', size: 'md', disabled: false, busy: false },
    {
      class: 'ms-2',
      id: 'save',
      'data-testid': 'save',
      'aria-describedby': 'save-help',
      type: 'submit',
    },
  ),
  buttonCase('Button/small with an icon', {
    ...buttonDefaults,
    size: 'sm',
    icon: sampleIcons.check,
    mirrorIcon: true,
  }),
  buttonCase('Button/busy with an icon', {
    ...buttonDefaults,
    busy: true,
    icon: sampleIcons.check,
  }),
  buttonCase('Button/busy link', { ...buttonDefaults, href: '#orders', busy: true }),
  buttonCase('Button/disabled and busy', { ...buttonDefaults, disabled: true, busy: true }),
  iconCase(
    'Icon/with an aria-label attribute',
    { size: 'md', mirror: false, svg: sampleIcons.alert },
    { 'aria-label': 'Warning' },
  ),
];

function buttonCase(story: string, args: ButtonArgs, attributes: Attributes = {}): ParityCase {
  const props = {
    variant: args.variant,
    size: args.size,
    disabled: args.disabled,
    busy: args.busy,
    mirrorIcon: args.mirrorIcon ?? false,
    mirrorTrailing: args.mirrorTrailing ?? false,
    ...(args.href ? { href: args.href } : {}),
  };
  const named = {
    ...(args.icon ? { icon: args.icon } : {}),
    ...(args.trailingIcon ? { trailing: args.trailingIcon } : {}),
  };
  return {
    story,
    markup: button(args, attributes),
    vue: { component: PlinthButton, props: { ...props, ...attributes }, slot: args.label, named },
    blade: { component: 'button', props, attributes, slot: args.label, named },
  };
}

function iconCase(story: string, args: IconArgs, attributes: Attributes = {}): ParityCase {
  const props = {
    size: args.size,
    mirror: args.mirror,
    ...(args.label ? { label: args.label } : {}),
  };
  return {
    story,
    markup: icon(args, attributes),
    vue: { component: PlinthIcon, props: { ...props, ...attributes }, slot: args.svg, html: true },
    blade: { component: 'icon', props, attributes, slot: args.svg },
  };
}

function badgeWithAttributes(): ParityCase {
  const args: BadgeArgs = { label: 'Paid', tone: 'success', dot: true };
  const attributes: Attributes = {
    class: 'ms-2',
    id: 'order-status',
    'data-testid': 'order-status',
    'aria-describedby': 'order-status-help',
    title: 'Paid on 3 October',
  };
  return {
    story: 'Badge/with extra attributes',
    markup: badge(args, attributes),
    vue: {
      component: PlinthBadge,
      props: { tone: args.tone, dot: args.dot, ...attributes },
      slot: args.label,
    },
    blade: {
      component: 'badge',
      props: { tone: args.tone, dot: args.dot },
      attributes,
      slot: args.label,
    },
  };
}

describe('parity with the stories', () => {
  const blade = renderBlade(cases.map((c) => c.blade));

  it('has a case for every story', () => {
    expect(cases.map((c) => c.story)).toEqual([
      'Badge/Neutral',
      'Badge/Success',
      'Badge/Warning',
      'Badge/Danger',
      'Badge/WithDot',
      'Badge/with extra attributes',
      'Icon/Default',
      'Icon/Small',
      'Icon/Large',
      'Icon/Labelled',
      'Icon/Filled',
      'Icon/Mirrored',
      'Icon/with extra attributes',
      'Button/Primary',
      'Button/Secondary',
      'Button/Ghost',
      'Button/Danger',
      'Button/DangerGhost',
      'Button/Small',
      'Button/Large',
      'Button/WithIcon',
      'Button/WithTrailingIcon',
      'Button/Link',
      'Button/Disabled',
      'Button/DisabledLink',
      'Button/Busy',
      'Button/with extra attributes',
      'Button/small with an icon',
      'Button/busy with an icon',
      'Button/busy link',
      'Button/disabled and busy',
      'Icon/with an aria-label attribute',
    ]);
  });

  describe.each(cases.map((c, i) => [c.story, c, i] as const))('%s', (_story, c, i) => {
    it('Vue prints the story markup', async () => {
      const slots = {
        default: () => (c.vue.html ? createStaticVNode(c.vue.slot, 1) : c.vue.slot),
        ...Object.fromEntries(
          Object.entries(c.vue.named ?? {}).map(([name, html]) => [
            name,
            () => createStaticVNode(html, 1),
          ]),
        ),
      };
      const html = await renderToString(h(c.vue.component, c.vue.props, slots));
      expect(normalize(html)).toBe(normalize(c.markup));
    });

    it('Blade prints the story markup', () => {
      expect(normalize(blade[i]!)).toBe(normalize(c.markup));
    });
  });
});

describe('normalize', () => {
  it('ignores whitespace, attribute order and comments', () => {
    expect(normalize('<span  b="2" a="1">\n  <!--x--> <i>hi  there</i>\n</span>')).toBe(
      normalize('<span a="1" b="2"><i>hi there</i></span>'),
    );
  });

  it('still tells different markup apart', () => {
    expect(normalize('<span class="a">x</span>')).not.toBe(normalize('<span class="b">x</span>'));
    expect(normalize('<span>x</span>')).not.toBe(normalize('<span><i></i>x</span>'));
  });
});
