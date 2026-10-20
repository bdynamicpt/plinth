import type { Meta, StoryObj } from '@storybook/html-vite';
import { drawerDesktops, drawerSnaps, swipeToClose } from '@bdynamic/plinth-vue';
import { button } from './button.ts';
import { drawer, type DrawerArgs } from './drawer.ts';
import { listCard } from './list-card.ts';
import type { ListRowArgs } from './list-row.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/list-row.css';
import '@bdynamic/plinth-css/src/components/list-card.css';
import '@bdynamic/plinth-css/src/components/modal.css';
import '@bdynamic/plinth-css/src/components/drawer.css';

const action = (label: string, variant: 'primary' | 'secondary', extra = {}) =>
  button({ label, variant, size: 'md', disabled: false, busy: false }, extra);

const row = (title: string, extra: Partial<ListRowArgs> = {}): ListRowArgs => ({
  title,
  chevron: false,
  button: false,
  current: false,
  disabled: false,
  ...extra,
});

/** A route's steps, long enough to scroll at the full height. */
const steps = listCard({
  heading: 'Steps',
  headingLevel: 'h3',
  rows: [
    row('Head north on Harbour Road', { trailing: '400 m' }),
    row('Turn right onto the river path', { trailing: '1.2 km' }),
    row('Cross the old bridge', { trailing: '300 m' }),
    row('Keep left at the fork', { trailing: '800 m' }),
    row('Turn left onto Station Street', { trailing: '600 m' }),
    row('Arrive at the library', { trailing: '50 m' }),
  ],
});

const footer = (id: string) =>
  action('Share', 'secondary') + action('Start', 'primary', { commandfor: id, command: 'close' });

/** A button that opens the drawer with no script: commandfor and command="show-modal". */
const opener = (args: DrawerArgs) =>
  action('Show the route', 'secondary', { commandfor: args.id, command: 'show-modal' });

const meta = {
  title: 'Components/Drawer',
  render: (args) => opener(args) + drawer(args),
  // The story adds what the layers add (swipeToClose: closing when it is swiped off, and opening
  // at its snap point) and opens the drawer, as an app would with showModal(). In the docs page the
  // drawers stay closed until their button is pressed.
  play: ({ canvasElement }) => {
    const dialog = canvasElement.querySelector<HTMLDialogElement>('dialog.plinth-drawer');
    if (!dialog) return;
    swipeToClose(dialog);
    dialog.showModal();
  },
  args: {
    id: 'route',
    title: 'Route to the library',
    description: '12 min by bike, 3.4 km.',
    closeLabel: 'Close',
    desktop: 'dialog',
    body: steps,
    footer: footer('route'),
  },
  argTypes: {
    title: { control: 'text' },
    description: { control: 'text' },
    closeLabel: { control: 'text' },
    desktop: { control: 'inline-radio', options: [...drawerDesktops] },
    snapPoints: { control: 'check', options: [...drawerSnaps] },
    snap: { control: 'inline-radio', options: [...drawerSnaps] },
    body: { control: false },
    footer: { control: false },
  },
  parameters: {
    // The open dialog takes no room in the page, so the frames at every width get their height.
    everyWidth: { height: 720 },
    docs: {
      description: {
        component:
          'A panel on the bottom edge of a phone that the person drags, with optional snap points (peek, half and full); dragged down past the lowest it closes. From 768px up it is a dialog, or a sheet with `desktop="sheet"`. Give it a title; the close button and Escape close it without dragging.',
      },
    },
  },
} satisfies Meta<DrawerArgs>;

export default meta;
type Story = StoryObj<DrawerArgs>;

/** No snap points: as tall as its content, dragged down to close. A dialog from 768px up. */
export const Default: Story = {};

/** Snap points peek, half and full, opened at the peek: the handle, the header and a little more. */
export const Peek: Story = {
  args: {
    id: 'route-peek',
    snapPoints: ['peek', 'half', 'full'],
    snap: 'peek',
    footer: footer('route-peek'),
  },
};

/** The same snap points, opened at half the screen's height. */
export const Half: Story = {
  args: {
    id: 'route-half',
    snapPoints: ['peek', 'half', 'full'],
    snap: 'half',
    footer: footer('route-half'),
  },
};

/** The same snap points, opened at the full height. */
export const Full: Story = {
  args: {
    id: 'route-full',
    snapPoints: ['peek', 'half', 'full'],
    snap: 'full',
    footer: footer('route-full'),
  },
};

/** A panel on the end edge from 768px up, like the sheet: `desktop="sheet"`. */
export const SheetOnDesktop: Story = {
  args: {
    id: 'route-sheet',
    desktop: 'sheet',
    snapPoints: ['half', 'full'],
    snap: 'half',
    footer: footer('route-sheet'),
  },
};

/** With no description and no footer. */
export const TitleOnly: Story = {
  args: { id: 'route-title-only', description: undefined, footer: undefined },
};
