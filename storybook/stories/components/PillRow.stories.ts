import type { Meta, StoryObj } from '@storybook/html-vite';
import { pillRow, type PillArgs, type PillRowArgs } from './pill-row.ts';
import '@bdynamic/plinth-css/src/components/pill-row.css';

const filter = (label: string, extra: Partial<PillArgs> = {}): PillArgs => ({
  label,
  selected: false,
  disabled: false,
  ...extra,
});

const statuses = [
  filter('All', { count: 48, selected: true }),
  filter('Open', { count: 12 }),
  filter('In review', { count: 5 }),
  filter('Closed', { count: 31 }),
];

const meta = {
  title: 'Components/Pill Row',
  render: (args) => pillRow(args),
  args: { label: 'Status', nav: false, pills: statuses },
  parameters: {
    docs: {
      description: {
        component:
          'Filters, segments or sub-pages as pills. Scrolls sideways and snaps on a phone.',
      },
    },
  },
} satisfies Meta<PillRowArgs>;

export default meta;
type Story = StoryObj<PillRowArgs>;

/** Filters: each pill is a toggle button with aria-pressed. */
export const Filters: Story = {};

export const WithoutCounts: Story = {
  args: {
    label: 'Period',
    pills: [filter('Today'), filter('This week', { selected: true }), filter('This month')],
  },
};

export const NoneSelected: Story = {
  args: { label: 'Tags', pills: [filter('Design'), filter('Research'), filter('Writing')] },
};

/** Several filters on at once: each toggles on its own. */
export const MultipleSelected: Story = {
  args: {
    label: 'Tags',
    pills: [
      filter('Design', { selected: true }),
      filter('Research'),
      filter('Writing', { selected: true }),
    ],
  },
};

/** A row of links: a <nav>, and the pill for the page being shown has aria-current="page". */
export const Navigation: Story = {
  args: {
    label: 'Project sections',
    nav: true,
    pills: [
      filter('Overview', { href: '#overview', selected: true }),
      filter('Tasks', { href: '#tasks', count: 8 }),
      filter('Files', { href: '#files' }),
      filter('Settings', { href: '#settings' }),
    ],
  },
};

export const Disabled: Story = {
  args: {
    pills: [
      filter('All', { count: 48, selected: true }),
      filter('Open', { count: 12 }),
      filter('Archived', { count: 0, disabled: true }),
    ],
  },
};

export const DisabledLink: Story = {
  args: {
    label: 'Project sections',
    nav: true,
    pills: [
      filter('Overview', { href: '#overview', selected: true }),
      filter('Reports', { href: '#reports', disabled: true }),
    ],
  },
};

/** More pills than a phone can show: they scroll sideways and snap; wider screens wrap them. */
export const Overflowing: Story = {
  args: {
    label: 'Category',
    pills: [
      filter('Everything', { selected: true }),
      ...[
        'Announcements',
        'Engineering',
        'Design',
        'Marketing',
        'Operations',
        'Support',
        'Finance',
        'People',
        'Legal',
      ].map((label) => filter(label)),
    ],
  },
};

/** The same row in right-to-left text: it starts and scrolls from the right. */
export const RightToLeft: Story = {
  render: () => `<div dir="rtl">${pillRow({ ...meta.args, ...Overflowing.args })}</div>`,
};
