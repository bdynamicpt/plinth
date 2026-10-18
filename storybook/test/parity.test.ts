import {
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthIcon,
  PlinthIconButton,
  PlinthListCard,
  PlinthListRow,
  PlinthPill,
  PlinthPillRow,
  PlinthSheet,
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
import * as listCardStories from '../stories/components/ListCard.stories.ts';
import { listCard, listCardRows, type ListCardArgs } from '../stories/components/list-card.ts';
import * as listRowStories from '../stories/components/ListRow.stories.ts';
import { listRow, type ListRowArgs } from '../stories/components/list-row.ts';
import * as pillRowStories from '../stories/components/PillRow.stories.ts';
import { pill, pillRow, type PillArgs, type PillRowArgs } from '../stories/components/pill-row.ts';
import * as sheetStories from '../stories/components/Sheet.stories.ts';
import { sheet, type SheetArgs } from '../stories/components/sheet.ts';
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

const sheetDefaults: SheetArgs = {
  id: 'filters',
  title: 'Filters',
  closeLabel: 'Close',
  placement: 'center',
  body: '<p>Body</p>',
  footer: '<button type="button">Apply</button>',
};

const pillDefaults: PillArgs = { label: 'Open', selected: false, disabled: false };

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
  listRowCase('List row/current static row', { ...listRowDefaults, current: true }),
  listRowCase('List row/disabled static row', { ...listRowDefaults, disabled: true }),
  ...storyArgs<ListCardArgs>(listCardStories).map(([story, args]) =>
    listCardCase(`List card/${story}`, args),
  ),
  listCardCase(
    'List card/with extra attributes',
    {
      heading: 'Account',
      headingLevel: 'h3',
      footer: 'On this device only.',
      rows: [listRowDefaults],
    },
    { class: 'mb-4', id: 'account', 'data-testid': 'account', 'aria-describedby': 'account-help' },
  ),
  listCardCase('List card/blank heading and footer', {
    heading: '  ',
    headingLevel: 'h2',
    footer: ' ',
    rows: [listRowDefaults],
  }),
  listCardCase('List card/unknown heading level', {
    heading: 'Account',
    headingLevel: 'h1' as ListCardArgs['headingLevel'],
    rows: [listRowDefaults],
  }),
  ...storyArgs<PillRowArgs>(pillRowStories).map(([story, args]) =>
    pillRowCase(`Pill row/${story}`, args),
  ),
  pillRowCase(
    'Pill row/with extra attributes',
    { nav: false, pills: [pillDefaults] },
    { class: 'mb-4', id: 'status', 'data-testid': 'status', 'aria-labelledby': 'status-title' },
  ),
  pillCase('Pill/Default', pillDefaults),
  pillCase('Pill/Selected', { ...pillDefaults, selected: true }),
  pillCase('Pill/WithCount', { ...pillDefaults, count: 12 }),
  pillCase('Pill/ZeroCount', { ...pillDefaults, count: 0 }),
  pillCase('Pill/Disabled', { ...pillDefaults, disabled: true }),
  pillCase('Pill/Link', { ...pillDefaults, href: '#open' }),
  pillCase('Pill/CurrentLink', { ...pillDefaults, href: '#open', selected: true, count: '3' }),
  pillCase('Pill/DisabledLink', { ...pillDefaults, href: '#open', disabled: true }),
  pillCase(
    'Pill/with extra attributes',
    { ...pillDefaults, count: 12 },
    {
      class: 'ms-2',
      id: 'open',
      'data-testid': 'open',
      'aria-describedby': 'open-help',
      type: 'submit',
    },
  ),
  pillCase(
    'Pill/link with extra attributes',
    { ...pillDefaults, href: '#open' },
    { class: 'ms-2', 'data-testid': 'open', type: 'text/html' },
  ),
  ...storyArgs<SheetArgs>(sheetStories).map(([story, args]) => sheetCase(`Sheet/${story}`, args)),
  sheetCase(
    'Sheet/with extra attributes',
    { ...sheetDefaults, description: 'Narrow the list down.' },
    {
      class: 'is-busy',
      'data-testid': 'filters',
      'aria-busy': 'true',
      closedby: 'closerequest',
    },
  ),
  sheetCase('Sheet/blank description, no footer', {
    ...sheetDefaults,
    description: '  ',
    footer: undefined,
  }),
  sheetCase('Sheet/unknown placement', {
    ...sheetDefaults,
    placement: 'start' as SheetArgs['placement'],
  }),
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

/** The card's own parity; its rows are each a list row's markup in an <li>, passed in as the slot. */
function listCardCase(story: string, args: ListCardArgs, attributes: Attributes = {}): ParityCase {
  const props = {
    ...(args.heading ? { heading: args.heading } : {}),
    headingLevel: args.headingLevel,
    ...(args.footer ? { footer: args.footer } : {}),
  };
  const slot = listCardRows(args.rows);
  return {
    story,
    markup: listCard(args, attributes),
    vue: { component: PlinthListCard, props: { ...props, ...attributes }, slot, html: true },
    blade: { component: 'list-card', props, attributes, slot },
  };
}

function pillProps(args: PillArgs) {
  return {
    ...(args.count !== undefined ? { count: args.count } : {}),
    ...(args.href ? { href: args.href } : {}),
    selected: args.selected,
    disabled: args.disabled,
  };
}

function pillCase(story: string, args: PillArgs, attributes: Attributes = {}): ParityCase {
  const props = pillProps(args);
  return {
    story,
    markup: pill(args, attributes),
    vue: { component: PlinthPill, props: { ...props, ...attributes }, slot: args.label },
    blade: { component: 'pill', props, attributes, slot: args.label },
  };
}

/** The row's own parity; its pills are each a pill case's markup, passed in as the slot. */
function pillRowCase(story: string, args: PillRowArgs, attributes: Attributes = {}): ParityCase {
  const props = { ...(args.label ? { label: args.label } : {}), nav: args.nav };
  const slot = args.pills.map((p) => pill(p)).join('');
  return {
    story,
    markup: pillRow(args, attributes),
    vue: { component: PlinthPillRow, props: { ...props, ...attributes }, slot, html: true },
    blade: { component: 'pill-row', props, attributes, slot },
  };
}

/** The sheet's own parity; its body and footer are markup, passed in as the slots. */
function sheetCase(story: string, args: SheetArgs, attributes: Attributes = {}): ParityCase {
  const props = {
    id: args.id,
    title: args.title,
    ...(args.description ? { description: args.description } : {}),
    closeLabel: args.closeLabel,
    placement: args.placement,
  };
  const named: Record<string, string> = args.footer ? { footer: args.footer } : {};
  return {
    story,
    markup: sheet(args, attributes),
    vue: {
      component: PlinthSheet,
      props: { ...props, ...attributes },
      slot: args.body,
      html: true,
      named,
    },
    blade: { component: 'sheet', props, attributes, slot: args.body, named },
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
      'List row/LongValue',
      'List row/with extra attributes',
      'List row/link with extra attributes',
      'List row/current button',
      'List row/current static row',
      'List row/disabled static row',
      'List card/Default',
      'List card/WithoutHeading',
      'List card/WithFooter',
      'List card/HeadingLevel',
      'List card/SingleRow',
      'List card/MixedRows',
      'List card/LongText',
      'List card/with extra attributes',
      'List card/blank heading and footer',
      'List card/unknown heading level',
      'Pill row/Filters',
      'Pill row/WithoutCounts',
      'Pill row/NoneSelected',
      'Pill row/MultipleSelected',
      'Pill row/Navigation',
      'Pill row/Disabled',
      'Pill row/DisabledLink',
      'Pill row/Overflowing',
      'Pill row/with extra attributes',
      'Pill/Default',
      'Pill/Selected',
      'Pill/WithCount',
      'Pill/ZeroCount',
      'Pill/Disabled',
      'Pill/Link',
      'Pill/CurrentLink',
      'Pill/DisabledLink',
      'Pill/with extra attributes',
      'Pill/link with extra attributes',
      'Sheet/Default',
      'Sheet/WithDescription',
      'Sheet/SidePanel',
      'Sheet/WithoutFooter',
      'Sheet/Confirmation',
      'Sheet/LongContent',
      'Sheet/LongTitle',
      'Sheet/with extra attributes',
      'Sheet/blank description, no footer',
      'Sheet/unknown placement',
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
