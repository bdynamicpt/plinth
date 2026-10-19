import type { Meta, StoryObj } from '@storybook/html-vite';
import { button } from './button.ts';
import { callout, calloutRoles, calloutTones, type CalloutArgs } from './callout.ts';
import { sampleIcons } from './icons.ts';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/callout.css';
import '@bdynamic/plinth-css/src/components/icon.css';

const action = (label: string, variant: 'secondary' | 'ghost' | 'danger') =>
  button({ label, variant, size: 'sm', disabled: false, busy: false });

const meta = {
  title: 'Components/Callout',
  render: (args) => callout(args),
  args: {
    tone: 'neutral',
    role: 'note',
    title: 'Drafts are private',
    text: 'Only you can see a draft until you send it.',
  },
  argTypes: {
    tone: { control: 'inline-radio', options: calloutTones },
    role: { control: 'inline-radio', options: calloutRoles },
    title: { control: 'text' },
    text: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A note inside a page: a tone with its icon, an optional title, the text and optional actions. Use it for what the reader should know before going on, not for a message that comes and goes. The title or the text says what kind of note it is; the tone and the icon only reinforce it. It is a `note` by default; when the app adds one after something happens, make it a `status`, or an `alert` when it is urgent. For a reliable announcement, keep an empty container with that role in the page and put the callout in it when the event happens.',
      },
    },
  },
} satisfies Meta<CalloutArgs>;

export default meta;
type Story = StoryObj<CalloutArgs>;

export const Neutral: Story = {};

export const Info: Story = {
  args: {
    tone: 'info',
    title: 'Invoices are sent at 9:00',
    text: 'Invoices you approve after that go out the next morning.',
  },
};

export const Success: Story = {
  args: {
    tone: 'success',
    role: 'status',
    title: 'Invoice sent',
    text: 'Acme Studio will get INV-1042 by email in a few minutes.',
  },
};

export const Warning: Story = {
  args: {
    tone: 'warning',
    title: 'Your trial ends in 3 days',
    text: 'Add a payment method to keep your projects and your team’s access.',
    actions: action('Add payment method', 'secondary') + action('Remind me later', 'ghost'),
  },
};

export const Danger: Story = {
  args: {
    tone: 'danger',
    role: 'alert',
    title: 'The export failed',
    text: 'We couldn’t reach the storage service. Your projects are safe; try again in a few minutes.',
    actions: action('Try again', 'secondary'),
  },
};

export const WithoutTitle: Story = {
  args: {
    tone: 'info',
    title: undefined,
    text: 'Archived projects stay readable for 90 days, then they are deleted.',
  },
};

export const WithLink: Story = {
  args: {
    tone: 'warning',
    title: 'Override semantic tokens, never primitives',
    textHtml:
      'Components never read the <code>--plinth-ref-*</code> primitives, so changing one does nothing you can rely on. See <a href="#token-tiers">the token tiers</a>.',
  },
};

export const CustomIcon: Story = {
  args: {
    tone: 'info',
    title: 'Weekly digest',
    text: 'Every Monday, each member of the team gets a summary of their open tasks.',
    icon: sampleIcons.bell,
  },
};

export const LongText: Story = {
  args: {
    tone: 'neutral',
    title: 'Projects with many members and long names wrap onto more lines without overflowing',
    text: 'The quarterly-planning-and-budget-review-for-the-design-and-engineering-teams project has 48 members, and every one of them gets a notification when an invoice is approved, rejected or sent back for changes.',
  },
};

/** Every tone, as a note. */
export const AllTones: Story = {
  render: () =>
    `<div style="display: flex; flex-direction: column; gap: var(--plinth-space-3);">${calloutTones
      .map((tone) =>
        callout({
          tone,
          role: 'note',
          title: `${tone[0]!.toUpperCase()}${tone.slice(1)}`,
          text: 'A note inside a page.',
        }),
      )
      .join('')}</div>`,
};
