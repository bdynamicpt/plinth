import type { Meta, StoryObj } from '@storybook/html-vite';
import { header, type HeaderArgs } from './header.ts';
import { iconButton } from './icon-button.ts';
import { sampleIcons } from './icons.ts';
import { listCard } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';
import '@bdynamic/plinth-css/src/components/header.css';

const action = (
  label: string,
  svg: string,
  extra: Partial<Parameters<typeof iconButton>[0]> = {},
) =>
  iconButton({ label, variant: 'ghost', size: 'md', disabled: false, busy: false, svg, ...extra });

/** A menu button that opens the app's menu sheet with no script. */
const menu = iconButton(
  {
    label: 'Menu',
    variant: 'ghost',
    size: 'md',
    disabled: false,
    busy: false,
    svg: sampleIcons.menu,
  },
  { commandfor: 'menu', command: 'show-modal' },
);

/** A back link; its arrow points the other way in right-to-left text. */
const back = action('Back', sampleIcons.back, { href: '#inbox', mirror: true });

const search = action('Search', sampleIcons.search);
const more = action('More', sampleIcons.more);
const notifications = action('Notifications', sampleIcons.bell);

const meta = {
  title: 'Components/Header',
  // The docs page is Header.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => header(args),
  args: { title: 'Inbox', leading: menu, actions: search + more },
  // The header spans the page, as it does in an app.
  parameters: { layout: 'fullscreen' },
  argTypes: {
    title: { control: 'text' },
    leading: { control: false },
    actions: { control: false },
  },
} satisfies Meta<HeaderArgs>;

export default meta;
type Story = StoryObj<HeaderArgs>;

/** A menu button, the title and two actions. */
export const Default: Story = {};

/** A page further in: a back link leads, one action trails. */
export const WithBack: Story = { args: { title: 'Message', leading: back, actions: more } };

/** The top of a section, with no leading action. */
export const WithoutLeading: Story = {
  args: { title: 'Overview', leading: undefined, actions: notifications + search },
};

export const TitleOnly: Story = {
  args: { title: 'Settings', leading: undefined, actions: undefined },
};

/** A title too long for the bar ends in an ellipsis. */
export const LongTitle: Story = {
  args: {
    title: 'A page title long enough to run out of room on a phone screen',
    leading: back,
    actions: search + more,
  },
};

const row = (title: string): ListRowArgs => ({
  title,
  href: `#${title.toLowerCase().replace(/\s+/g, '-')}`,
  chevron: true,
  button: false,
  current: false,
  disabled: false,
});

const conversations = Array.from({ length: 4 }, (_, card) =>
  listCard({
    heading: `Week ${card + 1}`,
    headingLevel: 'h2',
    rows: ['Weekly planning', 'Design review', 'Release notes', 'Support handover'].map((title) =>
      row(`${title} ${card + 1}`),
    ),
  }),
).join('');

/** The header on a page: it sticks to the top while the content scrolls under it. */
export const OnAPage: Story = {
  render: () =>
    `${header(meta.args)}<main style="display: grid; gap: var(--plinth-space-6); padding: var(--plinth-space-4);">${conversations}</main>`,
};

/** The same header in right-to-left text: the parts swap sides and the back arrow points right. */
export const RightToLeft: Story = {
  render: () => `<div dir="rtl">${header({ ...meta.args, ...WithBack.args })}</div>`,
};
