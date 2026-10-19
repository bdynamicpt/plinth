import {
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthCallout,
  PlinthCodeBlock,
  PlinthDataTable,
  PlinthDataTableCell,
  PlinthDataTableColumn,
  PlinthDataTableEmpty,
  PlinthDataTableRow,
  PlinthDataTableSort,
  PlinthHeader,
  PlinthIcon,
  PlinthIconButton,
  PlinthListCard,
  PlinthListRow,
  PlinthMenuSheet,
  PlinthPill,
  PlinthPillRow,
  PlinthSectionMenu,
  PlinthSectionMenuItem,
  PlinthSheet,
} from '@bdynamic/plinth-vue';
import {
  PlinthBadge as ReactBadge,
  PlinthButton as ReactButton,
  PlinthCallout as ReactCallout,
  PlinthCodeBlock as ReactCodeBlock,
  PlinthIcon as ReactIcon,
  PlinthIconButton as ReactIconButton,
} from '@bdynamic/plinth-react';
import { createElement, type ComponentType } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { createStaticVNode, h, type Component } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { describe, expect, it } from 'vitest';
import * as avatarStories from '../stories/components/Avatar.stories.ts';
import { avatar, type AvatarArgs } from '../stories/components/avatar.ts';
import * as badgeStories from '../stories/components/Badge.stories.ts';
import { badge, type Attributes, type BadgeArgs } from '../stories/components/badge.ts';
import * as buttonStories from '../stories/components/Button.stories.ts';
import { button, type ButtonArgs } from '../stories/components/button.ts';
import * as calloutStories from '../stories/components/Callout.stories.ts';
import {
  callout,
  calloutRoles,
  calloutTones,
  type CalloutArgs,
} from '../stories/components/callout.ts';
import * as codeBlockStories from '../stories/components/CodeBlock.stories.ts';
import { codeBlock, type CodeBlockArgs } from '../stories/components/code-block.ts';
import { escape } from '../stories/components/markup.ts';
import * as dataTableStories from '../stories/components/DataTable.stories.ts';
import {
  dataTable,
  dataTableBody,
  dataTableCell,
  dataTableColumn,
  dataTableEmpty,
  dataTableHead,
  dataTableRow,
  dataTableSortButton,
  type DataTableArgs,
  type DataTableCellArgs,
  type DataTableColumnArgs,
  type DataTableRowArgs,
} from '../stories/components/data-table.ts';
import * as headerStories from '../stories/components/Header.stories.ts';
import { header, type HeaderArgs } from '../stories/components/header.ts';
import * as iconButtonStories from '../stories/components/IconButton.stories.ts';
import { iconButton, type IconButtonArgs } from '../stories/components/icon-button.ts';
import * as iconStories from '../stories/components/Icon.stories.ts';
import { icon, type IconArgs } from '../stories/components/icon.ts';
import * as listCardStories from '../stories/components/ListCard.stories.ts';
import { listCard, listCardRows, type ListCardArgs } from '../stories/components/list-card.ts';
import * as listRowStories from '../stories/components/ListRow.stories.ts';
import { listRow, type ListRowArgs } from '../stories/components/list-row.ts';
import * as menuSheetStories from '../stories/components/MenuSheet.stories.ts';
import { menuSheet, type MenuSheetArgs } from '../stories/components/menu-sheet.ts';
import * as pillRowStories from '../stories/components/PillRow.stories.ts';
import { pill, pillRow, type PillArgs, type PillRowArgs } from '../stories/components/pill-row.ts';
import * as sectionMenuStories from '../stories/components/SectionMenu.stories.ts';
import {
  sectionMenu,
  sectionMenuItem,
  type SectionMenuArgs,
  type SectionMenuItemArgs,
} from '../stories/components/section-menu.ts';
import * as sheetStories from '../stories/components/Sheet.stories.ts';
import { sheet, type SheetArgs } from '../stories/components/sheet.ts';
import { sampleIcons } from '../stories/components/icons.ts';
import { htmlToReact, normalize, reactProps, renderBlade, withoutAlpine } from './markup.ts';

/**
 * Parity: for every story of a component, the Blade, Vue and React output must match the story's
 * markup (ignoring whitespace and attribute order). If a layer drifts from the contract, this
 * fails. Stories with their own render (galleries such as AllTones) are not single cases.
 *
 * Each component also has a case with extra attributes, as a project adds them (a class, an id,
 * data-* and aria-*), so attribute forwarding cannot drift between the layers either.
 *
 * React takes the same props as Vue (docs/adr/0006), so a case's React side is its Vue side
 * with slots as `children` and node props. The React layer is being ported (#65, #66):
 * `reactComponents` lists the components that have one so far.
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

/** Each Vue component that has a React one so far, and that React component. */
const reactComponents = new Map<Component, unknown>([
  [PlinthBadge, ReactBadge],
  [PlinthIcon, ReactIcon],
  [PlinthButton, ReactButton],
  [PlinthIconButton, ReactIconButton],
  [PlinthCodeBlock, ReactCodeBlock],
  [PlinthCallout, ReactCallout],
]);

/**
 * A case's React output, from its Vue side: attributes become props (`class` is `className`),
 * the default slot is `children`, and named slots are props that take a node.
 */
function renderReact(component: unknown, vue: ParityCase['vue']): string {
  const slot = vue.html ? htmlToReact(vue.slot) : vue.slot;
  const named = Object.entries(vue.named ?? {}).map(([name, html]) => [name, htmlToReact(html)]);
  const props = { ...reactProps(vue.props), ...Object.fromEntries(named), children: slot };
  return renderToStaticMarkup(
    createElement(component as ComponentType<Record<string, unknown>>, props),
  );
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

const menuSheetDefaults: MenuSheetArgs = {
  id: 'menu',
  title: 'Menu',
  closeLabel: 'Close',
  userName: 'Sam Lee',
  userDetail: 'sam@example.com',
  userHref: '#profile',
  nav: '<a href="#inbox">Inbox</a>',
  account: '<button type="button">Sign out</button>',
};

const pillDefaults: PillArgs = { label: 'Open', selected: false, disabled: false };
const sectionMenuItemDefaults: SectionMenuItemArgs = {
  label: 'Tasks',
  href: '#tasks',
  current: false,
  disabled: false,
};

const dataTableColumnDefaults: DataTableColumnArgs = {
  label: 'Date',
  numeric: false,
  hideOnPhone: false,
};
const dataTableCellDefaults: DataTableCellArgs = {
  label: 'Date',
  content: '3 Oct 2026',
  kind: 'field',
  numeric: false,
  hideOnPhone: false,
};

const codeBlockDefaults: CodeBlockArgs = {
  code: 'npm ci',
  tabsLabel: 'Language',
  copy: true,
  copyLabel: 'Copy',
  copiedLabel: 'Copied',
};

const calloutDefaults: CalloutArgs = {
  tone: 'info',
  role: 'note',
  title: 'Invoices are sent at 9:00',
  text: 'Invoices you approve after that go out the next morning.',
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
  // A project's own value for an attribute the button also sets wins, in every layer.
  buttonCase('Button/with its own aria-disabled', buttonDefaults, { 'aria-disabled': 'true' }),
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
  ...storyArgs<SectionMenuArgs>(sectionMenuStories).map(([story, args]) =>
    sectionMenuCase(`Section menu/${story}`, args),
  ),
  sectionMenuCase(
    'Section menu/with extra attributes',
    { nav: true, items: [sectionMenuItemDefaults] },
    { class: 'sticky', id: 'sections', 'data-testid': 'sections', 'aria-labelledby': 'title' },
  ),
  sectionMenuCase('Section menu/blank label', { label: ' ', nav: true, items: [] }),
  sectionMenuItemCase('Section menu item/blank href', { ...sectionMenuItemDefaults, href: ' ' }),
  sectionMenuItemCase('Section menu item/Default', sectionMenuItemDefaults),
  sectionMenuItemCase('Section menu item/Current', { ...sectionMenuItemDefaults, current: true }),
  sectionMenuItemCase('Section menu item/WithCount', { ...sectionMenuItemDefaults, count: 8 }),
  sectionMenuItemCase('Section menu item/ZeroCount', { ...sectionMenuItemDefaults, count: 0 }),
  sectionMenuItemCase('Section menu item/Disabled', { ...sectionMenuItemDefaults, disabled: true }),
  sectionMenuItemCase('Section menu item/Button', { ...sectionMenuItemDefaults, href: undefined }),
  sectionMenuItemCase('Section menu item/CurrentButton', {
    ...sectionMenuItemDefaults,
    href: undefined,
    current: true,
    count: '3',
  }),
  sectionMenuItemCase('Section menu item/DisabledButton', {
    ...sectionMenuItemDefaults,
    href: undefined,
    disabled: true,
  }),
  sectionMenuItemCase(
    'Section menu item/with extra attributes',
    { ...sectionMenuItemDefaults, count: 8 },
    { class: 'ms-2', id: 'tasks', 'data-testid': 'tasks', 'aria-describedby': 'tasks-help' },
  ),
  sectionMenuItemCase(
    'Section menu item/button with extra attributes',
    { ...sectionMenuItemDefaults, href: undefined },
    { class: 'ms-2', 'data-testid': 'week', type: 'submit' },
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
  sheetCase('Sheet/empty footer', { ...sheetDefaults, footer: '  ' }),
  sheetCase('Sheet/id with spaces', { ...sheetDefaults, id: 'filters' }, {}, ' filters '),
  sheetCase('Sheet/unknown placement', {
    ...sheetDefaults,
    placement: 'start' as SheetArgs['placement'],
  }),
  ...storyArgs<MenuSheetArgs>(menuSheetStories).map(([story, args]) =>
    menuSheetCase(`Menu sheet/${story}`, args),
  ),
  menuSheetCase('Menu sheet/with extra attributes', menuSheetDefaults, {
    class: 'is-shell',
    'data-testid': 'menu',
    'aria-describedby': 'menu-hint',
    closedby: 'closerequest',
  }),
  menuSheetCase('Menu sheet/blank user parts and account', {
    ...menuSheetDefaults,
    userDetail: ' ',
    userHref: ' ',
    userSrc: ' ',
    account: '  ',
  }),
  menuSheetCase('Menu sheet/blank user name', { ...menuSheetDefaults, userName: '  ' }),
  menuSheetCase('Menu sheet/id with spaces', menuSheetDefaults, {}, ' menu '),
  ...storyArgs<HeaderArgs>(headerStories).map(([story, args]) =>
    headerCase(`Header/${story}`, args),
  ),
  headerCase(
    'Header/with extra attributes',
    { title: 'Inbox', actions: '<button type="button">Search</button>' },
    { class: 'app-header', id: 'top', 'data-testid': 'header', 'aria-label': 'Inbox' },
  ),
  headerCase('Header/blank slots', { title: 'Settings', leading: '  ', actions: ' ' }),
  ...storyArgs<DataTableArgs>(dataTableStories).map(([story, args]) =>
    dataTableCase(`Data table/${story}`, args),
  ),
  dataTableCase(
    'Data table/with extra attributes',
    { caption: undefined, columns: [dataTableColumnDefaults], rows: [] },
    { class: 'mt-4', id: 'orders', 'data-testid': 'orders', 'aria-label': 'Orders' },
  ),
  dataTableCase('Data table/blank caption', {
    caption: '  ',
    columns: [dataTableColumnDefaults],
    rows: [],
  }),
  dataTableColumnCase('Data table column/Default', dataTableColumnDefaults),
  dataTableColumnCase('Data table column/Numeric', { ...dataTableColumnDefaults, numeric: true }),
  dataTableColumnCase('Data table column/HiddenOnPhone', {
    ...dataTableColumnDefaults,
    hideOnPhone: true,
  }),
  dataTableColumnCase('Data table column/Sortable', { ...dataTableColumnDefaults, sort: 'none' }),
  dataTableColumnCase('Data table column/Ascending', {
    ...dataTableColumnDefaults,
    sort: 'ascending',
    numeric: true,
  }),
  dataTableColumnCase('Data table column/Descending', {
    ...dataTableColumnDefaults,
    sort: 'descending',
  }),
  dataTableColumnCase('Data table column/unknown sort', {
    ...dataTableColumnDefaults,
    sort: 'sideways' as DataTableColumnArgs['sort'],
  }),
  dataTableColumnCase(
    'Data table column/with extra attributes',
    { ...dataTableColumnDefaults, sort: 'none' },
    { class: 'w-32', id: 'date', 'data-key': 'date', 'aria-describedby': 'date-help' },
  ),
  dataTableSortCase('Data table sort/Default', 'Date'),
  dataTableSortCase('Data table sort/with extra attributes', 'Date', {
    class: 'is-busy',
    'data-key': 'date',
    'aria-describedby': 'date-help',
  }),
  dataTableRowCase('Data table row/Default', {}),
  dataTableRowCase('Data table row/Selected', { selected: true }),
  dataTableRowCase('Data table row/NotSelected', { selected: false }),
  dataTableRowCase(
    'Data table row/with extra attributes',
    { selected: true },
    { class: 'is-new', id: 'order-1042', 'data-key': '1042', 'aria-describedby': 'order-help' },
  ),
  dataTableCellCase('Data table cell/Field', dataTableCellDefaults),
  dataTableCellCase('Data table cell/Title', { ...dataTableCellDefaults, kind: 'title' }),
  dataTableCellCase('Data table cell/Actions', {
    ...dataTableCellDefaults,
    label: undefined,
    kind: 'actions',
    content: '<button type="button">View</button>',
  }),
  dataTableCellCase('Data table cell/Numeric', {
    ...dataTableCellDefaults,
    numeric: true,
    content: '€86.50',
  }),
  dataTableCellCase('Data table cell/HiddenOnPhone', {
    ...dataTableCellDefaults,
    hideOnPhone: true,
  }),
  dataTableCellCase('Data table cell/blank label', { ...dataTableCellDefaults, label: ' ' }),
  dataTableCellCase('Data table cell/unknown kind', {
    ...dataTableCellDefaults,
    kind: 'header' as DataTableCellArgs['kind'],
  }),
  dataTableCellCase('Data table cell/with extra attributes', dataTableCellDefaults, {
    class: 'truncate',
    id: 'date-1042',
    'data-key': 'date',
    'aria-describedby': 'date-help',
  }),
  dataTableEmptyCase('Data table empty/Default', 'No orders yet.', 5),
  dataTableEmptyCase('Data table empty/no columns', 'No orders yet.', 0),
  dataTableEmptyCase('Data table empty/with extra attributes', 'No orders yet.', 3, {
    class: 'is-filtered',
    id: 'empty',
    'data-testid': 'empty',
    'aria-describedby': 'empty-help',
  }),
  iconCase(
    'Icon/with an aria-label attribute',
    { size: 'md', mirror: false, svg: sampleIcons.alert },
    { 'aria-label': 'Warning' },
  ),
  ...storyArgs<CodeBlockArgs>(codeBlockStories).map(([story, args]) =>
    codeBlockCase(`Code block/${story}`, args),
  ),
  codeBlockCase(
    'Code block/with extra attributes',
    { ...codeBlockDefaults, id: 'install', label: 'Terminal' },
    { class: 'ms-2', 'data-testid': 'install', 'aria-describedby': 'install-help' },
  ),
  codeBlockCase('Code block/blank label and id', { ...codeBlockDefaults, id: ' ', label: '  ' }),
  codeBlockCase('Code block/highlighted tab and seven tabs', {
    ...codeBlockDefaults,
    id: 'many',
    tabs: [
      {
        label: 'PHP',
        code: 'echo',
        html: '<span style="color: var(--plinth-color-accent-text)">echo</span>',
      },
      ...Array.from({ length: 6 }, (_, i) => ({ label: `Tab ${i}`, code: `code ${i}` })),
    ],
  }),
  codeBlockCase('Code block/unknown selected tab', {
    ...codeBlockDefaults,
    id: 'pick',
    tabs: [
      { label: 'Vue', code: '<PlinthBadge />' },
      { label: 'React', code: '<PlinthBadge />' },
    ],
    selected: 'Svelte',
    tabsLabel: 'Framework',
  }),
  ...storyArgs<CalloutArgs>(calloutStories).map(([story, args]) =>
    calloutCase(`Callout/${story}`, args),
  ),
  calloutCase('Callout/with extra attributes', calloutDefaults, {
    class: 'mb-4',
    id: 'sending-time',
    'data-testid': 'sending-time',
    'aria-labelledby': 'sending-time-title',
  }),
  calloutCase('Callout/unknown tone and role', {
    ...calloutDefaults,
    tone: 'loud' as CalloutArgs['tone'],
    role: 'log' as CalloutArgs['role'],
  }),
  calloutCase('Callout/blank title and text', { ...calloutDefaults, title: '  ', text: ' ' }),
  calloutCase('Callout/title only', { ...calloutDefaults, text: '' }),
  calloutCase('Callout/escaped text', {
    ...calloutDefaults,
    title: 'Fish & <chips>',
    text: '"Quotes" & <tags>',
  }),
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

function headerCase(story: string, args: HeaderArgs, attributes: Attributes = {}): ParityCase {
  const props = { title: args.title };
  const named = {
    ...(args.leading ? { leading: args.leading } : {}),
    ...(args.actions ? { actions: args.actions } : {}),
  };
  return {
    story,
    markup: header(args, attributes),
    vue: { component: PlinthHeader, props: { ...props, ...attributes }, slot: '', named },
    blade: { component: 'header', props, attributes, slot: '', named },
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

function sectionMenuItemProps(args: SectionMenuItemArgs) {
  return {
    ...(args.count !== undefined ? { count: args.count } : {}),
    ...(args.href !== undefined ? { href: args.href } : {}),
    current: args.current,
    disabled: args.disabled,
  };
}

function sectionMenuItemCase(
  story: string,
  args: SectionMenuItemArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = sectionMenuItemProps(args);
  return {
    story,
    markup: sectionMenuItem(args, attributes),
    vue: { component: PlinthSectionMenuItem, props: { ...props, ...attributes }, slot: args.label },
    blade: { component: 'section-menu-item', props, attributes, slot: args.label },
  };
}

/** The menu's own parity; its items are each an item case's markup, passed in as the slot. */
function sectionMenuCase(
  story: string,
  args: SectionMenuArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = { ...(args.label !== undefined ? { label: args.label } : {}), nav: args.nav };
  const slot = args.items.map((item) => sectionMenuItem(item)).join('');
  return {
    story,
    markup: sectionMenu(args, attributes),
    vue: { component: PlinthSectionMenu, props: { ...props, ...attributes }, slot, html: true },
    blade: { component: 'section-menu', props, attributes, slot },
  };
}

/** The menu sheet's parity; its nav and account are markup, passed in as the slots. */
function menuSheetCase(
  story: string,
  args: MenuSheetArgs,
  attributes: Attributes = {},
  id: string = args.id,
): ParityCase {
  const props = {
    id,
    title: args.title,
    closeLabel: args.closeLabel,
    ...Object.fromEntries(
      (['userName', 'userDetail', 'userSrc', 'userHref'] as const)
        .filter((name) => args[name] !== undefined)
        .map((name) => [name, args[name]]),
    ),
  };
  const named: Record<string, string> = args.account ? { account: args.account } : {};
  return {
    story,
    markup: menuSheet(args, attributes),
    vue: {
      component: PlinthMenuSheet,
      props: { ...props, ...attributes },
      slot: args.nav,
      html: true,
      named,
    },
    blade: { component: 'menu-sheet', props, attributes, slot: args.nav, named },
  };
}

/** The sheet's own parity; its body and footer are markup, passed in as the slots. */
function sheetCase(
  story: string,
  args: SheetArgs,
  attributes: Attributes = {},
  id: string = args.id,
): ParityCase {
  const props = {
    id,
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

/** The data table's parity; its column headers and rows are markup, passed in as the slots. */
function dataTableCase(
  story: string,
  args: DataTableArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = args.caption !== undefined ? { caption: args.caption } : {};
  const named = { head: dataTableHead(args.columns) };
  const slot = dataTableBody(args);
  return {
    story,
    markup: dataTable(args, attributes),
    vue: {
      component: PlinthDataTable,
      props: { ...props, ...attributes },
      slot,
      html: true,
      named,
    },
    blade: { component: 'data-table', props, attributes, slot, named },
  };
}

function dataTableColumnCase(
  story: string,
  args: DataTableColumnArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = {
    ...(args.sort !== undefined ? { sort: args.sort } : {}),
    numeric: args.numeric,
    hideOnPhone: args.hideOnPhone,
  };
  const slot = args.sort === undefined ? args.label : dataTableSortButton(args.label);
  return {
    story,
    markup: dataTableColumn(args, slot, attributes),
    vue: {
      component: PlinthDataTableColumn,
      props: { ...props, ...attributes },
      slot,
      html: args.sort !== undefined,
    },
    blade: { component: 'data-table-column', props, attributes, slot },
  };
}

function dataTableSortCase(story: string, label: string, attributes: Attributes = {}): ParityCase {
  return {
    story,
    markup: dataTableSortButton(label, attributes),
    vue: { component: PlinthDataTableSort, props: { ...attributes }, slot: label },
    blade: { component: 'data-table-sort', props: {}, attributes, slot: label },
  };
}

function dataTableRowCase(
  story: string,
  args: Omit<DataTableRowArgs, 'cells'>,
  attributes: Attributes = {},
): ParityCase {
  const props = args.selected !== undefined ? { selected: args.selected } : {};
  const slot = '<td>#1042</td>';
  return {
    story,
    markup: dataTableRow(args, slot, attributes),
    vue: { component: PlinthDataTableRow, props: { ...props, ...attributes }, slot, html: true },
    blade: { component: 'data-table-row', props, attributes, slot },
  };
}

function dataTableCellCase(
  story: string,
  args: DataTableCellArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = {
    ...(args.label !== undefined ? { label: args.label } : {}),
    kind: args.kind,
    numeric: args.numeric,
    hideOnPhone: args.hideOnPhone,
  };
  return {
    story,
    markup: dataTableCell(args, attributes),
    vue: {
      component: PlinthDataTableCell,
      props: { ...props, ...attributes },
      slot: args.content,
      html: args.content.startsWith('<'),
    },
    blade: { component: 'data-table-cell', props, attributes, slot: args.content },
  };
}

function dataTableEmptyCase(
  story: string,
  text: string,
  columns: number,
  attributes: Attributes = {},
): ParityCase {
  return {
    story,
    markup: dataTableEmpty(text, columns, attributes),
    vue: { component: PlinthDataTableEmpty, props: { columns, ...attributes }, slot: text },
    blade: { component: 'data-table-empty', props: { columns }, attributes, slot: text },
  };
}

function codeBlockCase(
  story: string,
  args: CodeBlockArgs,
  attributes: Attributes = {},
): ParityCase {
  const props = {
    ...(args.id !== undefined ? { id: args.id } : {}),
    ...(args.label !== undefined && !args.labelHtml ? { label: args.label } : {}),
    ...(args.tabs ? { tabs: args.tabs } : {}),
    ...(args.selected !== undefined ? { selected: args.selected } : {}),
    tabsLabel: args.tabsLabel,
    copy: args.copy,
    copyLabel: args.copyLabel,
    copiedLabel: args.copiedLabel,
  };
  const named: Record<string, string> = args.labelHtml ? { label: args.labelHtml } : {};
  const code = args.tabs ? '' : args.code;
  return {
    story,
    markup: codeBlock(args, attributes),
    vue: {
      component: PlinthCodeBlock,
      props: { ...props, ...(args.html !== undefined ? { html: args.html } : {}), ...attributes },
      slot: args.html !== undefined ? '' : code,
      named,
    },
    blade: {
      component: 'code-block',
      props,
      attributes,
      slot: args.html ?? escape(code),
      named,
    },
  };
}

function calloutCase(story: string, args: CalloutArgs, attributes: Attributes = {}): ParityCase {
  // The story prints unknown values as they are; the layers print the defaults.
  const markup = callout(
    {
      ...args,
      tone: calloutTones.includes(args.tone) ? args.tone : 'neutral',
      role: calloutRoles.includes(args.role) ? args.role : 'note',
    },
    attributes,
  );
  const props = { tone: args.tone, role: args.role, ...(args.title ? { title: args.title } : {}) };
  const named = {
    ...(args.actions ? { actions: args.actions } : {}),
    ...(args.icon ? { icon: args.icon } : {}),
  };
  const html = args.textHtml !== undefined;
  const slot = args.textHtml ?? args.text;
  return {
    story,
    markup,
    vue: { component: PlinthCallout, props: { ...props, ...attributes }, slot, html, named },
    blade: {
      component: 'callout',
      props,
      attributes,
      slot: html ? slot : escape(slot),
      named,
    },
  };
}

function badgeWithAttributes(): ParityCase {
  const args: BadgeArgs = { label: 'Paid', tone: 'success', dot: true };
  const attributes: Attributes = {
    class: 'ms-2',
    id: 'order-status',
    'data-testid': 'order-status',
    'data-status': 'paid',
    'aria-label': 'Order status: Paid',
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
      'Button/with its own aria-disabled',
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
      'Section menu/Default',
      'Section menu/WithCounts',
      'Section menu/Buttons',
      'Section menu/NoneCurrent',
      'Section menu/DisabledLink',
      'Section menu/DisabledButton',
      'Section menu/Overflowing',
      'Section menu/with extra attributes',
      'Section menu/blank label',
      'Section menu item/blank href',
      'Section menu item/Default',
      'Section menu item/Current',
      'Section menu item/WithCount',
      'Section menu item/ZeroCount',
      'Section menu item/Disabled',
      'Section menu item/Button',
      'Section menu item/CurrentButton',
      'Section menu item/DisabledButton',
      'Section menu item/with extra attributes',
      'Section menu item/button with extra attributes',
      'Sheet/Default',
      'Sheet/WithDescription',
      'Sheet/SidePanel',
      'Sheet/WithoutFooter',
      'Sheet/Confirmation',
      'Sheet/LongContent',
      'Sheet/LongTitle',
      'Sheet/with extra attributes',
      'Sheet/blank description, no footer',
      'Sheet/empty footer',
      'Sheet/id with spaces',
      'Sheet/unknown placement',
      'Menu sheet/Default',
      'Menu sheet/WithPhoto',
      'Menu sheet/StaticUser',
      'Menu sheet/WithoutUser',
      'Menu sheet/WithoutAccount',
      'Menu sheet/Grouped',
      'Menu sheet/LongNavigation',
      'Menu sheet/LongName',
      'Menu sheet/with extra attributes',
      'Menu sheet/blank user parts and account',
      'Menu sheet/blank user name',
      'Menu sheet/id with spaces',
      'Header/Default',
      'Header/WithBack',
      'Header/WithoutLeading',
      'Header/TitleOnly',
      'Header/LongTitle',
      'Header/with extra attributes',
      'Header/blank slots',
      'Data table/Default',
      'Data table/Sorted',
      'Data table/SortedAscending',
      'Data table/Selected',
      'Data table/HiddenOnPhone',
      'Data table/Empty',
      'Data table/LongText',
      'Data table/with extra attributes',
      'Data table/blank caption',
      'Data table column/Default',
      'Data table column/Numeric',
      'Data table column/HiddenOnPhone',
      'Data table column/Sortable',
      'Data table column/Ascending',
      'Data table column/Descending',
      'Data table column/unknown sort',
      'Data table column/with extra attributes',
      'Data table sort/Default',
      'Data table sort/with extra attributes',
      'Data table row/Default',
      'Data table row/Selected',
      'Data table row/NotSelected',
      'Data table row/with extra attributes',
      'Data table cell/Field',
      'Data table cell/Title',
      'Data table cell/Actions',
      'Data table cell/Numeric',
      'Data table cell/HiddenOnPhone',
      'Data table cell/blank label',
      'Data table cell/unknown kind',
      'Data table cell/with extra attributes',
      'Data table empty/Default',
      'Data table empty/no columns',
      'Data table empty/with extra attributes',
      'Icon/with an aria-label attribute',
      'Code block/Default',
      'Code block/WithoutLabel',
      'Code block/Tabs',
      'Code block/TabsWithLabel',
      'Code block/Highlighted',
      'Code block/LongLine',
      'Code block/LongLabel',
      'Code block/WithoutCopy',
      'Code block/CodeOnly',
      'Code block/LabelWithBadge',
      'Code block/with extra attributes',
      'Code block/blank label and id',
      'Code block/highlighted tab and seven tabs',
      'Code block/unknown selected tab',
      'Callout/Neutral',
      'Callout/Info',
      'Callout/Success',
      'Callout/Warning',
      'Callout/Danger',
      'Callout/WithoutTitle',
      'Callout/WithLink',
      'Callout/CustomIcon',
      'Callout/LongText',
      'Callout/with extra attributes',
      'Callout/unknown tone and role',
      'Callout/blank title and text',
      'Callout/title only',
      'Callout/escaped text',
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
      expect(normalize(withoutAlpine(blade[i]!))).toBe(normalize(c.markup));
    });

    const react = reactComponents.get(c.vue.component);
    if (react) {
      it('React prints the story markup', () => {
        expect(normalize(renderReact(react, c.vue))).toBe(normalize(c.markup));
      });
    }
  });
});

describe('the React side', () => {
  it('covers badge, icon, button, icon button, code block and callout', () => {
    const covered = new Set(
      cases.filter((c) => reactComponents.has(c.vue.component)).map((c) => c.story.split('/')[0]),
    );
    expect([...covered]).toEqual([
      'Badge',
      'Icon',
      'Button',
      'Icon button',
      'Code block',
      'Callout',
    ]);
  });

  it('turns markup into the elements React prints back', () => {
    const svg = sampleIcons.more;
    expect(normalize(renderToStaticMarkup(createElement('i', null, htmlToReact(svg))))).toBe(
      normalize(`<i>${svg}</i>`),
    );
    expect(
      normalize(renderToStaticMarkup(createElement('i', null, htmlToReact('a<b>c</b>')))),
    ).toBe(normalize('<i>a<b>c</b></i>'));
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
