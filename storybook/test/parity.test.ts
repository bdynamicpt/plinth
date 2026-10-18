import {
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthIcon,
  PlinthIconButton,
  PlinthListRow,
} from '@bdynamic/plinth-vue';
import { createStaticVNode, h, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import * as avatarStories from '../stories/components/Avatar.stories.ts';
import { avatar, type AvatarArgs } from '../stories/components/avatar.ts';
import * as badgeStories from '../stories/components/Badge.stories.ts';
import { badge, type Attributes, type BadgeArgs } from '../stories/components/badge.ts';
import * as buttonStories from '../stories/components/Button.stories.ts';
import { button, type ButtonArgs } from '../stories/components/button.ts';
import * as iconButtonStories from '../stories/components/IconButton.stories.ts';
import { iconButton, type IconButtonArgs } from '../stories/components/icon-button.ts';
import * as iconStories from '../stories/components/Icon.stories.ts';
import { icon, type IconArgs } from '../stories/components/icon.ts';
import * as listRowStories from '../stories/components/ListRow.stories.ts';
import { listRow, type ListRowArgs } from '../stories/components/list-row.ts';
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

const listRowDefaults: ListRowArgs = {
  title: 'Notifications',
  chevron: false,
  button: false,
  current: false,
  disabled: false,
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
  ...storyArgs<IconButtonArgs>(iconButtonStories).map(([story, args]) =>
    iconButtonCase(`Icon button/${story}`, args),
  ),
  iconButtonCase(
    'Icon button/with extra attributes',
    {
      label: 'Close',
      variant: 'secondary',
      size: 'md',
      disabled: false,
      busy: false,
      svg: sampleIcons.close,
    },
    { class: 'ms-2', id: 'close', 'data-testid': 'close', title: 'Close', type: 'submit' },
  ),
  iconButtonCase(
    'Icon button/with an aria-label attribute',
    {
      label: '',
      variant: 'ghost',
      size: 'sm',
      disabled: false,
      busy: false,
      svg: sampleIcons.more,
    },
    { 'aria-label': 'More actions' },
  ),
  ...storyArgs<AvatarArgs>(avatarStories).map(([story, args]) =>
    avatarCase(`Avatar/${story}`, args),
  ),
  avatarCase(
    'Avatar/with extra attributes',
    { name: 'Élio Ramos', size: 'lg', status: 'warning', statusLabel: 'Away', decorative: false },
    { class: 'ms-2', id: 'me', 'data-testid': 'me' },
  ),
  ...storyArgs<ListRowArgs>(listRowStories).map(([story, args]) =>
    listRowCase(`List row/${story}`, args),
  ),
  listRowCase(
    'List row/with extra attributes',
    { ...listRowDefaults, button: true },
    {
      class: 'ms-2',
      id: 'sign-out',
      'data-testid': 'sign-out',
      'aria-describedby': 'sign-out-help',
      type: 'submit',
    },
  ),
  listRowCase(
    'List row/link with extra attributes',
    { ...listRowDefaults, href: '#notifications', chevron: true },
    { class: 'ms-2', 'data-testid': 'notifications', type: 'text/html' },
  ),
  listRowCase('List row/current button', { ...listRowDefaults, button: true, current: true }),
  listRowCase('List row/disabled static row', { ...listRowDefaults, disabled: true }),
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

function iconButtonCase(
  story: string,
  args: IconButtonArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = {
    ...(args.label ? { label: args.label } : {}),
    variant: args.variant,
    size: args.size,
    disabled: args.disabled,
    busy: args.busy,
    mirror: args.mirror ?? false,
    ...(args.pressed !== undefined ? { pressed: args.pressed } : {}),
    ...(args.href ? { href: args.href } : {}),
  };
  return {
    story,
    markup: iconButton(args, attributes),
    vue: {
      component: PlinthIconButton,
      props: { ...props, ...attributes },
      slot: args.svg,
      html: true,
    },
    blade: { component: 'icon-button', props, attributes, slot: args.svg },
  };
}

function avatarCase(story: string, args: AvatarArgs, attributes: Attributes = {}): ParityCase {
  const props = {
    ...(args.name !== undefined ? { name: args.name } : {}),
    ...(args.src ? { src: args.src } : {}),
    ...(args.initials ? { initials: args.initials } : {}),
    size: args.size,
    ...(args.status ? { status: args.status } : {}),
    ...(args.statusLabel ? { statusLabel: args.statusLabel } : {}),
    decorative: args.decorative,
  };
  return {
    story,
    markup: avatar(args, attributes),
    vue: { component: PlinthAvatar, props: { ...props, ...attributes }, slot: '' },
    blade: { component: 'avatar', props, attributes, slot: '' },
  };
}

function listRowCase(story: string, args: ListRowArgs, attributes: Attributes = {}): ParityCase {
  const props = {
    ...(args.description ? { description: args.description } : {}),
    chevron: args.chevron,
    ...(args.href ? { href: args.href } : {}),
    button: args.button,
    current: args.current,
    disabled: args.disabled,
  };
  const named = {
    ...(args.leading ? { leading: args.leading } : {}),
    ...(args.trailing ? { trailing: args.trailing } : {}),
  };
  return {
    story,
    markup: listRow(args, attributes),
    vue: { component: PlinthListRow, props: { ...props, ...attributes }, slot: args.title, named },
    blade: { component: 'list-row', props, attributes, slot: args.title, named },
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
      'Button/Accent',
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
      'Icon button/Ghost',
      'Icon button/Secondary',
      'Icon button/Primary',
      'Icon button/DangerGhost',
      'Icon button/Small',
      'Icon button/Large',
      'Icon button/Pressed',
      'Icon button/NotPressed',
      'Icon button/Link',
      'Icon button/Disabled',
      'Icon button/Busy',
      'Icon button/with extra attributes',
      'Icon button/with an aria-label attribute',
      'Avatar/Initials',
      'Avatar/Image',
      'Avatar/GivenInitials',
      'Avatar/SingleName',
      'Avatar/Glyph',
      'Avatar/Small',
      'Avatar/Large',
      'Avatar/ExtraLarge',
      'Avatar/WithStatus',
      'Avatar/Decorative',
      'Avatar/with extra attributes',
      'List row/Default',
      'List row/WithDescription',
      'List row/WithIcon',
      'List row/WithAvatar',
      'List row/WithValue',
      'List row/WithBadge',
      'List row/Link',
      'List row/Button',
      'List row/Current',
      'List row/Disabled',
      'List row/DisabledLink',
      'List row/WithAction',
      'List row/LongText',
      'List row/with extra attributes',
      'List row/link with extra attributes',
      'List row/current button',
      'List row/disabled static row',
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
