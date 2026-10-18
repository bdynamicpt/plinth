import type { Meta, StoryObj } from '@storybook/html-vite';
import { button } from '../components/button.ts';
import '@bdynamic/plinth-css/src/components/button.css';
import './foundations.css';

/**
 * The live demonstration on the Focus ring page (FocusRing.mdx). Hidden from the sidebar, but a
 * story, so the test runner checks it with axe and the focus check.
 */
const meta = {
  title: 'Foundations/Focus ring',
  tags: ['!dev', '!autodocs'],
  parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;

export const Demo: StoryObj = {
  render: () =>
    `<div class="sb-demo">
      <div class="sb-demo-row">
        ${button({ label: 'A secondary button', variant: 'secondary', size: 'md', disabled: false, busy: false })}
        ${button({ label: 'A primary button', variant: 'primary', size: 'md', disabled: false, busy: false })}
      </div>
      <p class="sb-demo-text">A sentence with <a class="sb-demo-link" href="#focus-ring">a link in it</a>, and then <a class="sb-demo-link" href="#focus-ring">a longer link that wraps onto the next line</a> to show the ring on each line.</p>
    </div>`,
};
