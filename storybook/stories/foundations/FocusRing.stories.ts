import type { Meta, StoryObj } from '@storybook/html-vite';
import { codeBlock, group, page, pageParameters, section, tokenTable } from './page.ts';

const meta = {
  title: 'Foundations/Focus ring',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

const rule = `/* Most focusable elements: the ring sits on the edge */
.plinth-thing:focus-visible {
  outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
  outline-offset: var(--plinth-focus-ring-offset);
}

/* Solid filled controls: a small gap, so the ring doesn't merge with the fill */
.plinth-button[data-variant='primary']:focus-visible {
  outline: var(--plinth-focus-ring-width) solid var(--plinth-color-focus-ring);
  outline-offset: var(--plinth-focus-ring-offset-filled);
}`;

export const FocusRing: StoryObj = {
  name: 'Focus ring',
  render: () =>
    page(
      section(
        'Focus ring',
        'Every focusable element shows the same ring when it is focused from the keyboard (WCAG 2.4.7), links included. The ring sits on the edge of what is focused and follows its corners; a link in text gets one ring per line when it wraps. Solid filled controls keep a small gap, so the ring does not merge with their fill. Press Tab to see it, in light, dark and the example brand.',
        `<div class="sb-demo-row"><button type="button" class="sb-demo-outline">An outlined button</button><button type="button" class="sb-demo-button">A filled button</button></div><p class="sb-demo-text">A sentence with <a class="sb-demo-link" href="#focus-ring">a link in it</a>, and then <a class="sb-demo-link" href="#focus-ring">a longer link that wraps onto the next line</a> to show the ring on each line.</p>`,
      ),
      section(
        'The rule',
        "Each component repeats these lines on its focusable elements. It is an outline, so forced-colours mode keeps it, and it follows the element's border radius. The Storybook test runner tabs through every story and fails if a focused element does not show this ring.",
        codeBlock(rule, 'The focus ring rule'),
      ),
      section(
        'Tokens',
        'The colour stands out at least 3:1 against every surface, in both themes.',
        tokenTable([
          ...group('semantic', 'color').filter((t) => t.path[1] === 'focus-ring'),
          ...group('semantic', 'focus-ring'),
        ]),
      ),
    ),
};
