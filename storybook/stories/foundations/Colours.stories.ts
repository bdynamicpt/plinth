import type { Meta, StoryObj } from '@storybook/html-vite';
import { color, cssVar, cssVarName, palette, resolveRef } from '@bdynamic/plinth-tokens';
import { code, page, pageParameters, section, table } from './page.ts';

const meta = {
  title: 'Foundations/Colours',
  tags: ['!autodocs'],
  parameters: pageParameters,
} satisfies Meta;

export default meta;

const chip = (value: string, small = false) =>
  `<div class="sb-chip${small ? ' sb-chip-small' : ''}" style="background-color: ${value}"></div>`;

export const Colours: StoryObj = {
  render: () =>
    page(
      section(
        'Semantic colours',
        'What components use. Each one points at a palette step, one for light and one for dark; the swatch follows the theme in the toolbar.',
        table(
          ['Swatch', 'Token', 'Light', 'Dark'],
          Object.keys(color.light).map((name) => {
            const key = name as keyof typeof color.light;
            return [
              chip(cssVar('color', name), true),
              code(cssVarName('color', name)),
              `${code(color.light[key])} ${resolveRef(color.light[key])}`,
              `${code(color.dark[key])} ${resolveRef(color.dark[key])}`,
            ];
          }),
        ),
      ),
      ...Object.entries(palette).map(([scale, steps]) =>
        section(
          `Palette: ${scale}`,
          '',
          `<div class="sb-swatches">${Object.entries(steps)
            .map(
              ([step, value]) =>
                `<div class="sb-swatch">${chip(cssVar('palette', scale, step))}${code(
                  cssVarName('palette', scale, step),
                )}<span>${value}</span></div>`,
            )
            .join('')}</div>`,
        ),
      ),
    ),
};
