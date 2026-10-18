import type { Meta, StoryObj } from '@storybook/html-vite';
import { samplePhoto } from './avatar.ts';
import { header } from './header.ts';
import { iconButton } from './icon-button.ts';
import { sampleIcons } from './icons.ts';
import { listCard } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import { menuSheet, type MenuSheetArgs } from './menu-sheet.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/avatar.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';
import '@bdynamic/plinth-css/src/components/sheet.css';
import '@bdynamic/plinth-css/src/components/header.css';
import '@bdynamic/plinth-css/src/components/menu-sheet.css';

const row = (title: string, extra: Partial<ListRowArgs> = {}): ListRowArgs => ({
  title,
  href: `#${title.toLowerCase().replace(/\s+/g, '-')}`,
  chevron: false,
  button: false,
  current: false,
  disabled: false,
  ...extra,
});

/** Link rows, the one named by `current` marked aria-current="page". */
const links = (titles: string[], current?: string, heading?: string) =>
  listCard({
    heading,
    headingLevel: 'h3',
    rows: titles.map((title) => row(title, { current: title === current })),
  });

const nav = links(['Inbox', 'Projects', 'Calendar', 'Reports'], 'Inbox');

const account = listCard({
  headingLevel: 'h3',
  rows: [row('Settings'), row('Sign out', { href: undefined, button: true })],
});

/** The header's menu button: it opens the menu sheet with no script. */
const opener = (id: string) =>
  iconButton(
    {
      label: 'Menu',
      variant: 'ghost',
      size: 'md',
      disabled: false,
      busy: false,
      svg: sampleIcons.menu,
    },
    { commandfor: id, command: 'show-modal' },
  );

const meta = {
  title: 'Components/Menu Sheet',
  // The docs page is MenuSheet.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => opener(args.id) + menuSheet(args),
  // The story opens its menu, as the menu button would. In the docs page the menus stay closed
  // until their button is pressed.
  play: ({ canvasElement }) => {
    canvasElement.querySelector<HTMLDialogElement>('dialog.plinth-menu-sheet')?.showModal();
  },
  args: {
    id: 'menu',
    title: 'Menu',
    closeLabel: 'Close',
    userName: 'Sam Lee',
    userDetail: 'sam@example.com',
    userHref: '#profile',
    nav,
    account,
  },
  argTypes: {
    title: { control: 'text' },
    closeLabel: { control: 'text' },
    userName: { control: 'text' },
    userDetail: { control: 'text' },
    userSrc: { control: 'text' },
    userHref: { control: 'text' },
    nav: { control: false },
    account: { control: false },
  },
} satisfies Meta<MenuSheetArgs>;

export default meta;
type Story = StoryObj<MenuSheetArgs>;

/** The user, linking to the profile; the navigation with the current page; the account. */
export const Default: Story = {};

/** A picture instead of initials. */
export const WithPhoto: Story = { args: { id: 'menu-photo', userSrc: samplePhoto } };

/** No profile page: the user row is static, with no chevron, and no detail line. */
export const StaticUser: Story = {
  args: { id: 'menu-static', userHref: undefined, userDetail: undefined },
};

/** No one signed in: the menu starts with the navigation. */
export const WithoutUser: Story = {
  args: { id: 'menu-guest', userName: undefined, userDetail: undefined, userHref: undefined },
};

/** Navigation only, with no account actions. */
export const WithoutAccount: Story = { args: { id: 'menu-nav', account: undefined } };

/** The navigation in groups, each a list card with a heading. */
export const Grouped: Story = {
  args: {
    id: 'menu-grouped',
    nav:
      links(['Inbox', 'Starred', 'Sent'], 'Starred', 'Mail') +
      links(['Projects', 'Calendar', 'Reports'], undefined, 'Workspace'),
  },
};

/** More than fits: the body scrolls as one, and the account follows the navigation. */
export const LongNavigation: Story = {
  args: {
    id: 'menu-long',
    nav:
      links(['Inbox', 'Starred', 'Sent', 'Drafts', 'Archive'], 'Drafts', 'Mail') +
      links(['Projects', 'Calendar', 'Reports', 'Files', 'People'], undefined, 'Workspace') +
      links(['Help', 'What’s new', 'Send feedback'], undefined, 'Support'),
  },
};

/** A long name and detail wrap inside the row. */
export const LongName: Story = {
  args: {
    id: 'menu-long-name',
    userName: 'Maximiliana Alexandra Fernández-Oliveira',
    userDetail: 'maximiliana.alexandra.fernandez-oliveira@example.com',
  },
};

/** The header's menu button opens the menu (commandfor="menu", command="show-modal"). */
export const FromTheHeader: Story = {
  parameters: { layout: 'fullscreen' },
  render: (args) => header({ title: 'Inbox', leading: opener(args.id) }) + menuSheet(args),
};

/** Right-to-left text: the panel opens on the left, and the chevron points left. */
export const RightToLeft: Story = {
  render: (args) => {
    const rtl = { ...args, id: 'menu-rtl' };
    return `<div dir="rtl">${opener(rtl.id)}${menuSheet(rtl)}</div>`;
  },
};
