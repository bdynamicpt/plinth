import {
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthCallout,
  PlinthCodeBlock,
  PlinthConfirmDialog,
  PlinthDataTable,
  PlinthDataTableCell,
  PlinthDataTableColumn,
  PlinthDataTableEmpty,
  PlinthDataTableRow,
  PlinthDataTableSort,
  PlinthDialog,
  PlinthDrawer,
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
  PlinthAvatar as ReactAvatar,
  PlinthBadge as ReactBadge,
  PlinthButton as ReactButton,
  PlinthCallout as ReactCallout,
  PlinthCodeBlock as ReactCodeBlock,
  PlinthConfirmDialog as ReactConfirmDialog,
  PlinthDataTable as ReactDataTable,
  PlinthDataTableCell as ReactDataTableCell,
  PlinthDataTableColumn as ReactDataTableColumn,
  PlinthDataTableEmpty as ReactDataTableEmpty,
  PlinthDataTableRow as ReactDataTableRow,
  PlinthDataTableSort as ReactDataTableSort,
  PlinthDialog as ReactDialog,
  PlinthDrawer as ReactDrawer,
  PlinthHeader as ReactHeader,
  PlinthIcon as ReactIcon,
  PlinthIconButton as ReactIconButton,
  PlinthListCard as ReactListCard,
  PlinthListRow as ReactListRow,
  PlinthMenuSheet as ReactMenuSheet,
  PlinthPill as ReactPill,
  PlinthPillRow as ReactPillRow,
  PlinthSectionMenu as ReactSectionMenu,
  PlinthSectionMenuItem as ReactSectionMenuItem,
  PlinthSheet as ReactSheet,
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
import * as confirmDialogStories from '../stories/components/ConfirmDialog.stories.ts';
import { confirmDialog, type ConfirmDialogArgs } from '../stories/components/confirm-dialog.ts';
import * as dialogStories from '../stories/components/Dialog.stories.ts';
import { dialog, type DialogArgs } from '../stories/components/dialog.ts';
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
import * as drawerStories from '../stories/components/Drawer.stories.ts';
import { drawer, type DrawerArgs } from '../stories/components/drawer.ts';
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
 * data-* and aria-*), so attribute forwarding cannot drift between the layers either, and a case
 * with an attribute that clashes with one the component sets on its root, where the project's
 * value wins (docs/adr/0002). The header, list card and code block set no attribute on their root
 * but the class (the code block's id is a prop), so they have no clashing case.
 *
 * React takes the same props as Vue (docs/adr/0006), so a case's React side is its Vue side
 * with slots as `children` and node props.
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

/** Each Vue component and its React one. */
const reactComponents = new Map<Component, unknown>([
  [PlinthAvatar, ReactAvatar],
  [PlinthBadge, ReactBadge],
  [PlinthButton, ReactButton],
  [PlinthCallout, ReactCallout],
  [PlinthCodeBlock, ReactCodeBlock],
  [PlinthConfirmDialog, ReactConfirmDialog],
  [PlinthDataTable, ReactDataTable],
  [PlinthDataTableCell, ReactDataTableCell],
  [PlinthDataTableColumn, ReactDataTableColumn],
  [PlinthDataTableEmpty, ReactDataTableEmpty],
  [PlinthDataTableRow, ReactDataTableRow],
  [PlinthDataTableSort, ReactDataTableSort],
  [PlinthDialog, ReactDialog],
  [PlinthDrawer, ReactDrawer],
  [PlinthHeader, ReactHeader],
  [PlinthIcon, ReactIcon],
  [PlinthIconButton, ReactIconButton],
  [PlinthListCard, ReactListCard],
  [PlinthListRow, ReactListRow],
  [PlinthMenuSheet, ReactMenuSheet],
  [PlinthPill, ReactPill],
  [PlinthPillRow, ReactPillRow],
  [PlinthSectionMenu, ReactSectionMenu],
  [PlinthSectionMenuItem, ReactSectionMenuItem],
  [PlinthSheet, ReactSheet],
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
  side: 'end',
  body: '<p>Body</p>',
  footer: '<button type="button">Apply</button>',
};

const drawerDefaults: DrawerArgs = {
  id: 'route',
  title: 'Route',
  closeLabel: 'Close',
  desktop: 'dialog',
  body: '<p>Body</p>',
  footer: '<button type="button">Start</button>',
};

const dialogDefaults: DialogArgs = {
  id: 'project',
  title: 'Edit project',
  closeLabel: 'Close',
  dismissible: true,
  sidePhone: 'center',
  body: '<p>Body</p>',
  footer: '<button type="button">Save</button>',
};

const confirmDialogDefaults: ConfirmDialogArgs = {
  id: 'archive',
  title: 'Archive 3 tickets?',
  message: 'You can bring them back.',
  kind: 'simple',
  confirmLabel: 'Archive',
  cancelLabel: 'Cancel',
  tone: 'neutral',
  busy: false,
  sidePhone: 'center',
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
  ...storyArgs<BadgeArgs>(badgeStories).map(([story, args]) => badgeCase(`Badge/${story}`, args)),
  badgeCase(
    'Badge/with extra attributes',
    { label: 'Paid', tone: 'success', dot: true },
    {
      class: 'ms-2',
      id: 'order-status',
      'data-testid': 'order-status',
      'data-status': 'paid',
      'aria-label': 'Order status: Paid',
    },
  ),
  badgeCase(
    'Badge/with a clashing attribute',
    { label: 'Paid', tone: 'success', dot: false },
    { 'data-tone': 'danger' },
  ),
  ...storyArgs<IconArgs>(iconStories).map(([story, args]) => iconCase(`Icon/${story}`, args)),
  iconCase(
    'Icon/with extra attributes',
    { size: 'lg', label: 'Done', mirror: false, svg: sampleIcons.check },
    { class: 'ms-2', id: 'saved-icon', 'data-testid': 'saved-icon', title: 'Saved' },
  ),
  iconCase(
    'Icon/with a clashing attribute',
    { size: 'md', mirror: false, svg: sampleIcons.check },
    { 'aria-hidden': 'false' },
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
  buttonCase('Button/with its own aria-disabled', buttonDefaults, { 'aria-disabled': 'true' }),
  buttonCase('Button/with a clashing attribute', buttonDefaults, { 'data-variant': 'danger' }),
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
  withBlankLabel(
    iconButtonCase(
      'Icon button/with a blank label and an aria-label attribute',
      {
        label: '',
        variant: 'ghost',
        size: 'md',
        disabled: false,
        busy: false,
        svg: sampleIcons.arrow,
      },
      { 'aria-label': 'Next' },
    ),
  ),
  iconButtonCase(
    'Icon button/with a clashing attribute',
    {
      label: 'Bold',
      variant: 'ghost',
      size: 'md',
      disabled: false,
      busy: false,
      pressed: false,
      svg: sampleIcons.check,
    },
    { 'aria-pressed': 'mixed' },
  ),
  iconButtonCase(
    'Icon button/link with a clashing attribute',
    {
      label: 'Next',
      variant: 'ghost',
      size: 'md',
      href: '#next',
      disabled: true,
      busy: false,
      svg: sampleIcons.check,
    },
    { role: 'button' },
  ),
  ...storyArgs<AvatarArgs>(avatarStories).map(([story, args]) =>
    avatarCase(`Avatar/${story}`, args),
  ),
  avatarCase(
    'Avatar/with extra attributes',
    { name: 'Élio Ramos', size: 'lg', status: 'warning', statusLabel: 'Away', decorative: false },
    { class: 'ms-2', id: 'me', 'data-testid': 'me' },
  ),
  avatarCase(
    'Avatar/with a clashing attribute',
    { name: 'Sam Lee', size: 'md', decorative: false },
    { 'aria-label': 'Sam Lee, on call' },
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
  listRowCase(
    'List row/with a clashing attribute',
    { ...listRowDefaults, href: '#notifications', current: true },
    { 'aria-current': 'step' },
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
  pillRowCase(
    'Pill row/with a clashing attribute',
    { nav: false, pills: [pillDefaults] },
    { role: 'toolbar' },
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
  pillCase('Pill/with a clashing attribute', pillDefaults, { 'aria-pressed': 'mixed' }),
  ...storyArgs<SectionMenuArgs>(sectionMenuStories).map(([story, args]) =>
    sectionMenuCase(`Section menu/${story}`, args),
  ),
  sectionMenuCase(
    'Section menu/with extra attributes',
    { nav: true, items: [sectionMenuItemDefaults] },
    { class: 'sticky', id: 'sections', 'data-testid': 'sections', 'aria-labelledby': 'title' },
  ),
  sectionMenuCase(
    'Section menu/with a clashing attribute',
    { nav: false, items: [sectionMenuItemDefaults] },
    { role: 'toolbar' },
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
  sectionMenuItemCase(
    'Section menu item/with a clashing attribute',
    { ...sectionMenuItemDefaults, current: true },
    { 'aria-current': 'location' },
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
  sheetCase('Sheet/with a clashing attribute', sheetDefaults, {
    'aria-labelledby': 'filters-heading',
  }),
  sheetCase('Sheet/blank description, no footer', {
    ...sheetDefaults,
    description: '  ',
    footer: undefined,
  }),
  sheetCase('Sheet/empty footer', { ...sheetDefaults, footer: '  ' }),
  sheetCase('Sheet/id with spaces', { ...sheetDefaults, id: 'filters' }, {}, ' filters '),
  sheetCase('Sheet/unknown sides', {
    ...sheetDefaults,
    side: 'left' as SheetArgs['side'],
    sidePhone: 'right' as SheetArgs['sidePhone'],
  }),
  ...storyArgs<DrawerArgs>(drawerStories).map(([story, args]) =>
    drawerCase(`Drawer/${story}`, args),
  ),
  drawerCase(
    'Drawer/with extra attributes',
    { ...drawerDefaults, description: '12 min by bike.', snapPoints: ['peek', 'full'] },
    {
      class: 'is-busy',
      'data-testid': 'route',
      'aria-busy': 'true',
      closedby: 'closerequest',
    },
  ),
  drawerCase(
    'Drawer/with a clashing attribute',
    { ...drawerDefaults, snapPoints: ['peek', 'full'], snap: 'peek' },
    { 'data-snap': 'full' },
  ),
  drawerCase('Drawer/blank description, no footer', {
    ...drawerDefaults,
    description: '  ',
    footer: undefined,
  }),
  drawerCase('Drawer/empty footer', { ...drawerDefaults, footer: '  ' }),
  drawerCase('Drawer/id with spaces', { ...drawerDefaults, id: 'route' }, {}, ' route '),
  drawerCase('Drawer/unknown desktop and snap points', {
    ...drawerDefaults,
    desktop: 'side' as DrawerArgs['desktop'],
    snapPoints: ['top', 'full', 'half'] as DrawerArgs['snapPoints'],
    snap: 'peek',
  }),
  ...storyArgs<DialogArgs>(dialogStories).map(([story, args]) =>
    dialogCase(`Dialog/${story}`, args),
  ),
  dialogCase(
    'Dialog/with extra attributes',
    { ...dialogDefaults, description: 'The name shows to everyone.' },
    {
      class: 'is-busy',
      'data-testid': 'project',
      'aria-busy': 'true',
      closedby: 'closerequest',
    },
  ),
  dialogCase('Dialog/bottom on a phone, not dismissible', {
    ...dialogDefaults,
    sidePhone: 'bottom',
    dismissible: false,
  }),
  dialogCase('Dialog/with a clashing attribute', dialogDefaults, {
    'aria-labelledby': 'project-heading',
  }),
  dialogCase(
    'Dialog/not dismissible, with a clashing role',
    { ...dialogDefaults, dismissible: false },
    { role: 'dialog', closedby: 'none' },
  ),
  dialogCase('Dialog/blank description, no footer', {
    ...dialogDefaults,
    description: '  ',
    footer: undefined,
  }),
  dialogCase('Dialog/empty footer', { ...dialogDefaults, footer: '  ' }),
  dialogCase('Dialog/id with spaces', { ...dialogDefaults, id: 'project' }, {}, ' project '),
  dialogCase('Dialog/unknown side', {
    ...dialogDefaults,
    sidePhone: 'top' as DialogArgs['sidePhone'],
  }),
  ...storyArgs<ConfirmDialogArgs>(confirmDialogStories).map(([story, args]) =>
    confirmDialogCase(`Confirm dialog/${story}`, args),
  ),
  confirmDialogCase(
    'Confirm dialog/with extra attributes',
    { ...confirmDialogDefaults, kind: 'password' },
    { class: 'is-busy', 'data-testid': 'archive', 'aria-busy': 'true' },
  ),
  confirmDialogCase('Confirm dialog/with a clashing attribute', confirmDialogDefaults, {
    role: 'dialog',
    closedby: 'any',
  }),
  confirmDialogCase('Confirm dialog/a phrase with pattern characters', {
    ...confirmDialogDefaults,
    kind: 'type',
    phrase: ' a.b*c (d) [e] {f} |g\\h/i^$+? <j> ',
  }),
  confirmDialogCase('Confirm dialog/a label without the phrase', {
    ...confirmDialogDefaults,
    kind: 'type',
    phrase: 'harbour',
    fieldLabel: 'Type the name to confirm',
  }),
  confirmDialogCase('Confirm dialog/an error on the type kind', {
    ...confirmDialogDefaults,
    kind: 'type',
    phrase: 'harbour',
    error: 'That is not the name.',
  }),
  confirmDialogCase('Confirm dialog/an error without a field, and blank labels', {
    ...confirmDialogDefaults,
    error: 'Ignored',
    fieldLabel: '  ',
  }),
  confirmDialogCase('Confirm dialog/a blank error', {
    ...confirmDialogDefaults,
    kind: 'password',
    error: '  ',
  }),
  confirmDialogCase(
    'Confirm dialog/id with spaces',
    { ...confirmDialogDefaults, id: 'archive' },
    {},
    ' archive ',
  ),
  confirmDialogCase('Confirm dialog/unknown choices', {
    ...confirmDialogDefaults,
    kind: 'pin' as ConfirmDialogArgs['kind'],
    tone: 'loud' as ConfirmDialogArgs['tone'],
    sidePhone: 'top' as ConfirmDialogArgs['sidePhone'],
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
  menuSheetCase('Menu sheet/with a clashing attribute', menuSheetDefaults, {
    'aria-labelledby': 'menu-heading',
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
  dataTableCase(
    'Data table/with a clashing attribute',
    { caption: undefined, columns: [dataTableColumnDefaults], rows: [] },
    { role: 'grid' },
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
  dataTableColumnCase('Data table column/with a clashing attribute', dataTableColumnDefaults, {
    scope: 'colgroup',
  }),
  dataTableSortCase('Data table sort/Default', 'Date'),
  dataTableSortCase('Data table sort/with extra attributes', 'Date', {
    class: 'is-busy',
    'data-key': 'date',
    'aria-describedby': 'date-help',
  }),
  dataTableSortCase('Data table sort/with a clashing attribute', 'Date', { type: 'submit' }),
  dataTableRowCase('Data table row/Default', {}),
  dataTableRowCase('Data table row/Selected', { selected: true }),
  dataTableRowCase('Data table row/NotSelected', { selected: false }),
  dataTableRowCase(
    'Data table row/with extra attributes',
    { selected: true },
    { class: 'is-new', id: 'order-1042', 'data-key': '1042', 'aria-describedby': 'order-help' },
  ),
  dataTableRowCase(
    'Data table row/with a clashing attribute',
    { selected: true },
    { 'aria-selected': 'false' },
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
  dataTableCellCase('Data table cell/with a clashing attribute', dataTableCellDefaults, {
    role: 'gridcell',
  }),
  dataTableEmptyCase('Data table empty/Default', 'No orders yet.', 5),
  dataTableEmptyCase('Data table empty/no columns', 'No orders yet.', 0),
  dataTableEmptyCase('Data table empty/with extra attributes', 'No orders yet.', 3, {
    class: 'is-filtered',
    id: 'empty',
    'data-testid': 'empty',
    'aria-describedby': 'empty-help',
  }),
  dataTableEmptyCase('Data table empty/with a clashing attribute', 'No orders yet.', 3, {
    role: 'presentation',
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
  calloutCase('Callout/with a clashing attribute', calloutDefaults, { 'data-tone': 'danger' }),
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

/** Passes `label=""` itself, which iconButtonCase leaves out, so a blank label falls back. */
function withBlankLabel(c: ParityCase): ParityCase {
  return {
    ...c,
    vue: { ...c.vue, props: { label: '', ...c.vue.props } },
    blade: { ...c.blade, props: { label: '', ...c.blade.props } },
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

/** The confirmation dialog's parity; it has no slots. */
function confirmDialogCase(
  story: string,
  args: ConfirmDialogArgs,
  attributes: Attributes = {},
  id: string = args.id,
): ParityCase {
  const props = {
    id,
    ...Object.fromEntries(
      (
        [
          'title',
          'message',
          'kind',
          'phrase',
          'fieldLabel',
          'confirmLabel',
          'cancelLabel',
          'tone',
          'error',
          'busy',
          'sidePhone',
        ] as const
      )
        .filter((name) => args[name] !== undefined)
        .map((name) => [name, args[name]]),
    ),
  };
  return {
    story,
    markup: confirmDialog(args, attributes),
    vue: { component: PlinthConfirmDialog, props: { ...props, ...attributes }, slot: '' },
    blade: { component: 'confirm-dialog', props, attributes, slot: '' },
  };
}

/** The dialog's parity; its body and footer are markup, passed in as the slots. */
function dialogCase(
  story: string,
  args: DialogArgs,
  attributes: Attributes = {},
  id: string = args.id,
): ParityCase {
  const props = {
    id,
    title: args.title,
    ...(args.description ? { description: args.description } : {}),
    closeLabel: args.closeLabel,
    dismissible: args.dismissible,
    sidePhone: args.sidePhone,
  };
  const named: Record<string, string> = args.footer ? { footer: args.footer } : {};
  return {
    story,
    markup: dialog(args, attributes),
    vue: {
      component: PlinthDialog,
      props: { ...props, ...attributes },
      slot: args.body,
      html: true,
      named,
    },
    blade: { component: 'dialog', props, attributes, slot: args.body, named },
  };
}

/** The drawer's parity; its body and footer are markup, passed in as the slots. */
function drawerCase(
  story: string,
  args: DrawerArgs,
  attributes: Attributes = {},
  id: string = args.id,
): ParityCase {
  const props = {
    id,
    title: args.title,
    ...(args.description ? { description: args.description } : {}),
    closeLabel: args.closeLabel,
    desktop: args.desktop,
    ...(args.snapPoints ? { snapPoints: args.snapPoints } : {}),
    ...(args.snap ? { snap: args.snap } : {}),
  };
  const named: Record<string, string> = args.footer ? { footer: args.footer } : {};
  return {
    story,
    markup: drawer(args, attributes),
    vue: {
      component: PlinthDrawer,
      props: { ...props, ...attributes },
      slot: args.body,
      html: true,
      named,
    },
    blade: { component: 'drawer', props, attributes, slot: args.body, named },
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
    side: args.side,
    ...(args.sidePhone ? { sidePhone: args.sidePhone } : {}),
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

function badgeCase(story: string, args: BadgeArgs, attributes: Attributes = {}): ParityCase {
  return {
    story,
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
      'Badge/with a clashing attribute',
      'Icon/Default',
      'Icon/Small',
      'Icon/Large',
      'Icon/Labelled',
      'Icon/Filled',
      'Icon/Mirrored',
      'Icon/with extra attributes',
      'Icon/with a clashing attribute',
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
      'Button/with a clashing attribute',
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
      'Icon button/with a blank label and an aria-label attribute',
      'Icon button/with a clashing attribute',
      'Icon button/link with a clashing attribute',
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
      'Avatar/with a clashing attribute',
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
      'List row/with a clashing attribute',
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
      'Pill row/with a clashing attribute',
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
      'Pill/with a clashing attribute',
      'Section menu/Default',
      'Section menu/WithCounts',
      'Section menu/Buttons',
      'Section menu/NoneCurrent',
      'Section menu/DisabledLink',
      'Section menu/DisabledButton',
      'Section menu/Overflowing',
      'Section menu/with extra attributes',
      'Section menu/with a clashing attribute',
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
      'Section menu item/with a clashing attribute',
      'Sheet/Default',
      'Sheet/Start',
      'Sheet/Top',
      'Sheet/Bottom',
      'Sheet/EndBottomOnPhone',
      'Sheet/StartBottomOnPhone',
      'Sheet/TopBottomOnPhone',
      'Sheet/BottomStartOnPhone',
      'Sheet/StartEndOnPhone',
      'Sheet/BottomTopOnPhone',
      'Sheet/WithDescription',
      'Sheet/WithoutFooter',
      'Sheet/LongContent',
      'Sheet/LongTitle',
      'Sheet/with extra attributes',
      'Sheet/with a clashing attribute',
      'Sheet/blank description, no footer',
      'Sheet/empty footer',
      'Sheet/id with spaces',
      'Sheet/unknown sides',
      'Drawer/Default',
      'Drawer/Peek',
      'Drawer/Half',
      'Drawer/Full',
      'Drawer/SheetOnDesktop',
      'Drawer/TitleOnly',
      'Drawer/with extra attributes',
      'Drawer/with a clashing attribute',
      'Drawer/blank description, no footer',
      'Drawer/empty footer',
      'Drawer/id with spaces',
      'Drawer/unknown desktop and snap points',
      'Dialog/Default',
      'Dialog/WithDescription',
      'Dialog/NotDismissible',
      'Dialog/BottomOnPhone',
      'Dialog/WithoutFooter',
      'Dialog/LongContent',
      'Dialog/LongTitle',
      'Dialog/with extra attributes',
      'Dialog/bottom on a phone, not dismissible',
      'Dialog/with a clashing attribute',
      'Dialog/not dismissible, with a clashing role',
      'Dialog/blank description, no footer',
      'Dialog/empty footer',
      'Dialog/id with spaces',
      'Dialog/unknown side',
      'Confirm dialog/Default',
      'Confirm dialog/Danger',
      'Confirm dialog/TypeToConfirm',
      'Confirm dialog/TypeToConfirmTyping',
      'Confirm dialog/TypeToConfirmMatching',
      'Confirm dialog/Password',
      'Confirm dialog/PasswordBusy',
      'Confirm dialog/PasswordError',
      'Confirm dialog/BottomOnPhone',
      'Confirm dialog/LongText',
      'Confirm dialog/with extra attributes',
      'Confirm dialog/with a clashing attribute',
      'Confirm dialog/a phrase with pattern characters',
      'Confirm dialog/a label without the phrase',
      'Confirm dialog/an error on the type kind',
      'Confirm dialog/an error without a field, and blank labels',
      'Confirm dialog/a blank error',
      'Confirm dialog/id with spaces',
      'Confirm dialog/unknown choices',
      'Menu sheet/Default',
      'Menu sheet/WithPhoto',
      'Menu sheet/StaticUser',
      'Menu sheet/WithoutUser',
      'Menu sheet/WithoutAccount',
      'Menu sheet/Grouped',
      'Menu sheet/LongNavigation',
      'Menu sheet/LongName',
      'Menu sheet/with extra attributes',
      'Menu sheet/with a clashing attribute',
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
      'Data table/with a clashing attribute',
      'Data table/blank caption',
      'Data table column/Default',
      'Data table column/Numeric',
      'Data table column/HiddenOnPhone',
      'Data table column/Sortable',
      'Data table column/Ascending',
      'Data table column/Descending',
      'Data table column/unknown sort',
      'Data table column/with extra attributes',
      'Data table column/with a clashing attribute',
      'Data table sort/Default',
      'Data table sort/with extra attributes',
      'Data table sort/with a clashing attribute',
      'Data table row/Default',
      'Data table row/Selected',
      'Data table row/NotSelected',
      'Data table row/with extra attributes',
      'Data table row/with a clashing attribute',
      'Data table cell/Field',
      'Data table cell/Title',
      'Data table cell/Actions',
      'Data table cell/Numeric',
      'Data table cell/HiddenOnPhone',
      'Data table cell/blank label',
      'Data table cell/unknown kind',
      'Data table cell/with extra attributes',
      'Data table cell/with a clashing attribute',
      'Data table empty/Default',
      'Data table empty/no columns',
      'Data table empty/with extra attributes',
      'Data table empty/with a clashing attribute',
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
      'Callout/with a clashing attribute',
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

    it('React prints the story markup', () => {
      expect(normalize(renderReact(reactComponents.get(c.vue.component), c.vue))).toBe(
        normalize(c.markup),
      );
    });
  });
});

describe('the React side', () => {
  it('has a React component for every Vue one', () => {
    expect(cases.filter((c) => !reactComponents.has(c.vue.component))).toEqual([]);
  });

  it('turns markup into the elements React prints back', () => {
    const svg = sampleIcons.more;
    expect(normalize(renderToStaticMarkup(createElement('i', null, htmlToReact(svg))))).toBe(
      normalize(`<i>${svg}</i>`),
    );
    expect(
      normalize(renderToStaticMarkup(createElement('i', null, htmlToReact('a<b>c</b>')))),
    ).toBe(normalize('<i>a<b>c</b></i>'));
    const html = '<button disabled="" style="display: grid; --gap: 1rem">x</button>';
    expect(normalize(renderToStaticMarkup(createElement('i', null, htmlToReact(html))))).toBe(
      normalize(`<i>${html}</i>`),
    );
  });
});

describe('normalize', () => {
  it('ignores whitespace, attribute order and comments', () => {
    expect(normalize('<span  b="2" a="1">\n  <!--x--> <i>hi  there</i>\n</span>')).toBe(
      normalize('<span a="1" b="2"><i>hi there</i></span>'),
    );
  });

  it('ignores the spacing in a style', () => {
    expect(normalize('<i style="display:grid;gap:var(--x)">x</i>')).toBe(
      normalize('<i style=" display: grid ; gap: var(--x); ">x</i>'),
    );
  });

  it('still tells different markup apart', () => {
    expect(normalize('<span class="a">x</span>')).not.toBe(normalize('<span class="b">x</span>'));
    expect(normalize('<span>x</span>')).not.toBe(normalize('<span><i></i>x</span>'));
    expect(normalize('<i style="color: red">x</i>')).not.toBe(
      normalize('<i style="color: blue">x</i>'),
    );
  });
});
