import type { Meta, StoryObj } from '@storybook/html-vite';
import { header } from './header.ts';
import { iconButton } from './icon-button.ts';
import { sampleIcons } from './icons.ts';
import { sectionMenu, type SectionMenuArgs, type SectionMenuItemArgs } from './section-menu.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/header.css';
import '@bdynamic/plinth-css/src/components/section-menu.css';

const item = (label: string, extra: Partial<SectionMenuItemArgs> = {}): SectionMenuItemArgs => ({
  label,
  current: false,
  disabled: false,
  ...extra,
});

const sections = [
  item('Overview', { href: '#overview', current: true }),
  item('Tasks', { href: '#tasks', count: 8 }),
  item('Files', { href: '#files' }),
  item('Settings', { href: '#settings' }),
];

const meta = {
  title: 'Components/Section Menu',
  render: (args) => sectionMenu(args),
  args: { label: 'Project', nav: true, items: sections },
  // The menu spans the page, as it does under the header.
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: "The row under the header that switches between a page's sections.",
      },
    },
  },
} satisfies Meta<SectionMenuArgs>;

export default meta;
type Story = StoryObj<SectionMenuArgs>;

/** Links in a <nav>; the current section has aria-current="page". */
export const Default: Story = {};

export const WithCounts: Story = {
  args: {
    items: [
      item('Open', { href: '#open', count: 12, current: true }),
      item('In review', { href: '#review', count: 5 }),
      item('Closed', { href: '#closed', count: 0 }),
    ],
  },
};

/** Buttons that switch the view in place: a <div role="group">, each with aria-pressed. */
export const Buttons: Story = {
  args: {
    label: 'View',
    nav: false,
    items: [item('Day'), item('Week', { current: true }), item('Month')],
  },
};

export const NoneCurrent: Story = {
  args: { items: sections.map((s) => ({ ...s, current: false })) },
};

export const DisabledLink: Story = {
  args: {
    items: [
      item('Overview', { href: '#overview', current: true }),
      item('Reports', { href: '#reports', disabled: true }),
      item('Settings', { href: '#settings' }),
    ],
  },
};

export const DisabledButton: Story = {
  args: {
    label: 'View',
    nav: false,
    items: [item('Day', { current: true }), item('Week'), item('Year', { disabled: true })],
  },
};

/** More sections than the screen shows: the row scrolls sideways and snaps, at every width. */
export const Overflowing: Story = {
  args: {
    label: 'Workspace',
    items: [
      'Overview',
      'Activity',
      'Tasks',
      'Calendar',
      'Files',
      'Messages',
      'Reports',
      'Members',
      'Integrations',
      'Billing',
      'Settings',
      'Audit log',
      'Archive',
    ].map((label, index) => item(label, { href: `#section-${index}`, current: index === 0 })),
  },
};

/** The same menu in right-to-left text: it starts and scrolls from the right. */
export const RightToLeft: Story = {
  render: () => `<div dir="rtl">${sectionMenu({ ...meta.args, ...Overflowing.args })}</div>`,
};

/** Under the header, as in a phone app. */
export const UnderHeader: Story = {
  render: (args) =>
    header({
      title: 'Project',
      leading: iconButton({
        label: 'Back',
        variant: 'ghost',
        size: 'md',
        disabled: false,
        busy: false,
        href: '#projects',
        mirror: true,
        svg: sampleIcons.back,
      }),
    }) + sectionMenu(args),
};
