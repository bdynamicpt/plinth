import type { Decorator, Meta, StoryObj } from '@storybook/html-vite';
import { codeBlockText } from '@bdynamic/plinth-vue';
import { badge } from './badge.ts';
import { codeBlock, type CodeBlockArgs, type CodeBlockTab } from './code-block.ts';
import '@bdynamic/plinth-css/src/components/badge.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/code-block.css';

/**
 * What the Blade (Alpine), Vue and React layers add: the copy button shows, and copies the code
 * that shows. A demonstration for the stories; the plain HTML works without it, and no Plinth
 * script ships (ADR 2).
 */
const withCopy: Decorator = (story, { args }) => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = story() as string;
  wrapper.querySelectorAll<HTMLButtonElement>('.plinth-code-block-copy').forEach((button) => {
    button.hidden = false;
    button.addEventListener('click', () => {
      void navigator.clipboard?.writeText(codeBlockText(button)).then(() => {
        const label = button.querySelector('.plinth-button-label')!;
        const status = button.nextElementSibling!;
        const copyLabel = label.textContent;
        label.textContent = args.copiedLabel as string;
        status.textContent = args.copiedLabel as string;
        setTimeout(() => {
          label.textContent = copyLabel;
          status.textContent = '';
        }, 2000);
      });
    });
  });
  return wrapper;
};

const brand = `/* After Plinth's CSS: each colour for light and dark. */
:root {
  --plinth-color-accent: light-dark(#0f766e, #2dd4bf);
  --plinth-color-accent-hover: light-dark(#115e59, #5eead4);
  --plinth-color-on-accent: light-dark(#fff, #042f2e);
  --plinth-radius-pill: 0.25rem;
}`;

const layerTabs: CodeBlockTab[] = [
  {
    label: 'Blade',
    code: `<x-plinth::button variant="secondary" size="sm">
  New invoice
</x-plinth::button>`,
  },
  {
    label: 'Vue',
    code: `<PlinthButton variant="secondary" size="sm">
  New invoice
</PlinthButton>`,
  },
  {
    label: 'React',
    code: `<PlinthButton variant="secondary" size="sm">
  New invoice
</PlinthButton>`,
  },
  {
    label: 'HTML',
    code: `<button type="button" class="plinth-button"
  data-variant="secondary" data-size="sm">
  <span class="plinth-button-label">New invoice</span>
</button>`,
  },
];

/** A highlighter's output: spans coloured by the highlighter, here with Plinth's text colours. */
const highlighted = [
  '<span style="color: var(--plinth-color-accent-text)">INVOICES_API_URL</span>=<span style="color: var(--plinth-color-success-text)">https://api.example.com/v1</span>',
  '<span style="color: var(--plinth-color-accent-text)">INVOICES_API_KEY</span>=<span style="color: var(--plinth-color-success-text)">sk_test_4f9a2c7e1b</span>',
  '<span style="color: var(--plinth-color-text-muted)"># Keep the key out of version control.</span>',
].join('\n');

const meta = {
  title: 'Components/Code Block',
  render: (args) => codeBlock(args),
  decorators: [withCopy],
  args: {
    label: 'resources/css/brand.css',
    code: brand,
    tabsLabel: 'Language',
    copy: true,
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
  },
  argTypes: {
    id: { control: 'text' },
    label: { control: 'text' },
    labelHtml: { control: false },
    code: { control: 'text' },
    html: { control: false },
    tabs: { control: false },
    selected: { control: 'inline-radio', options: layerTabs.map((tab) => tab.label) },
    tabsLabel: { control: 'text' },
    copy: { control: 'boolean' },
    copyLabel: { control: 'text' },
    copiedLabel: { control: 'text' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'A block of code with an optional file name or label, a copy button and optional language tabs (Blade, Vue, React, HTML). Use it for install commands, configuration, API keys and examples. The code keeps its lines and scrolls sideways inside its own box on a phone. Highlighting is the project’s: pass the highlighter’s markup and the block styles what it is given. The copy button needs the Blade (Alpine), Vue or React layer; the plain HTML shows the code without it.',
      },
    },
  },
} satisfies Meta<CodeBlockArgs>;

export default meta;
type Story = StoryObj<CodeBlockArgs>;

/** A file name, the code and the copy button. */
export const Default: Story = {};

/** No label: the header holds only the copy button. */
export const WithoutLabel: Story = {
  args: { label: undefined, code: 'composer require bdynamicpt/plinth' },
};

/** Language tabs: the radio buttons pick the code that shows, with no script. */
export const Tabs: Story = {
  args: { id: 'new-invoice', label: undefined, tabs: layerTabs },
};

/** Tabs after a label, with another tab checked to start with. */
export const TabsWithLabel: Story = {
  args: { id: 'new-invoice-labelled', label: 'New invoice', tabs: layerTabs, selected: 'React' },
};

/** Code from a highlighter: the block keeps the highlighter's colours. */
export const Highlighted: Story = {
  args: { label: '.env', html: highlighted },
};

/** A long line scrolls sideways inside the block, never the page. */
export const LongLine: Story = {
  args: {
    label: 'Terminal',
    code: 'curl -H "Authorization: Bearer sk_test_4f9a2c7e1b" "https://api.example.com/v1/invoices?status=overdue&client=atlas-studio&per_page=50"',
  },
};

/** A long file name is cut short with an ellipsis. */
export const LongLabel: Story = {
  args: {
    label: 'resources/views/components/invoices/partials/summary-with-totals.blade.php',
    code: '<x-plinth::badge tone="success">Paid</x-plinth::badge>',
  },
};

/** No copy button, for code that is only read. */
export const WithoutCopy: Story = {
  args: { copy: false },
};

/** Neither a label nor a copy button: no header at all. */
export const CodeOnly: Story = {
  args: { label: undefined, copy: false, code: 'npm install @bdynamic/plinth' },
};

/** A label with a little markup, here a badge (label slot in Blade and Vue, a node in React). */
export const LabelWithBadge: Story = {
  args: {
    labelHtml: `HTML, from all three ${badge({ label: 'Parity', tone: 'success', dot: true })}`,
    code: layerTabs[3]!.code,
  },
};
