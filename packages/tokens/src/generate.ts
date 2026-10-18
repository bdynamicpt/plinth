import {
  breakpoint,
  color,
  cssVar,
  cssVarName,
  font,
  layer,
  motion,
  palette,
  parseRef,
  radius,
  size,
  space,
  vars,
  type Theme,
} from './index.ts';

const banner = '/* Built from packages/tokens/src/tokens.ts. Do not edit by hand. */';

type Declarations = [name: string, value: string][];

function declarations(group: Record<string | number, string>, ...path: string[]): Declarations {
  return Object.entries(group).map(([key, value]) => [cssVarName(...path, key), value]);
}

function block(selector: string, lines: Declarations, indent = ''): string {
  const body = lines.map(([name, value]) => `${indent}  ${name}: ${value};`).join('\n');
  return `${indent}${selector} {\n${body}\n${indent}}`;
}

function themeDeclarations(theme: Theme): Declarations {
  return [
    ['color-scheme', theme],
    ...Object.entries(color[theme]).map(([name, ref]): [string, string] => {
      const [scale, step] = parseRef(ref);
      return [cssVarName('color', name), cssVar('palette', scale, step)];
    }),
  ];
}

/**
 * The custom properties, inside `@layer plinth` like the components, so a project's own overrides
 * win however they are layered. Light is the default; dark applies with `data-theme="dark"` (or
 * the `.dark` class) on any ancestor, and follows the system when no theme is set.
 */
export function buildCss(): string {
  const root: Declarations = [
    ...Object.entries(palette).flatMap(([scale, steps]) =>
      declarations(steps as Record<string, string>, 'palette', scale),
    ),
    ...declarations(font.family, 'font'),
    ...declarations(font.size, 'font-size'),
    ...declarations(font.weight, 'font-weight'),
    ...declarations(font.leading, 'leading'),
    ...declarations(space, 'space'),
    ...declarations(size, 'size'),
    ...declarations(radius, 'radius'),
    ...declarations(layer, 'layer'),
    ...declarations(breakpoint, 'breakpoint'),
    ...declarations(motion.duration, 'duration'),
    ...declarations(motion.easing, 'easing'),
  ];

  const blocks = [
    block(':root', root),
    block(':root,\n[data-theme="light"]', themeDeclarations('light')),
    block('[data-theme="dark"],\n.dark', themeDeclarations('dark')),
    `@media (prefers-color-scheme: dark) {\n${block(
      ':root:not([data-theme="light"], .light)',
      themeDeclarations('dark'),
      '  ',
    )}\n}`,
    `@media (prefers-reduced-motion: reduce) {\n${block(
      ':root',
      Object.keys(motion.duration).map((key) => [cssVarName('duration', key), '0ms']),
      '  ',
    )}\n}`,
  ];

  const body = blocks.join('\n\n').replace(/^(?=.)/gm, '  ');
  return `${banner}\n\n@layer plinth {\n${body}\n}\n`;
}

/**
 * The tokens as Tailwind v4 theme variables (v4 has no JS presets). A project imports this after
 * `@import "tailwindcss"`, and its page code gets the same values as the components: `bg-surface`,
 * `text-text-muted`, `p-4`, `rounded-md`, `text-sm`, `md:…`. Values are the custom properties, so
 * a project's overrides and the dark theme apply to the utilities too.
 */
export function buildTailwindTheme(): string {
  const lines: Declarations = [
    ...themeEntries('color', vars.color),
    ['--font-sans', vars.font.family.sans],
    ['--font-mono', vars.font.family.mono],
    ...themeEntries('text', vars.font.size),
    ...themeEntries('font-weight', vars.font.weight),
    ...themeEntries('leading', vars.font.leading),
    // Tailwind multiplies one spacing unit (p-4 is 4 units); Plinth's is the 4px step.
    ['--spacing', vars.space[1]],
    ...themeEntries('radius', vars.radius),
    ...themeEntries('breakpoint', breakpoint),
    ...themeEntries('ease', vars.motion.easing),
  ];
  return `${banner}\n@theme inline {\n${lines.map(([n, v]) => `  ${n}: ${v};`).join('\n')}\n}\n`;
}

function themeEntries(namespace: string, group: Record<string, string>): Declarations {
  return Object.entries(group).map(([key, value]) => [`--${namespace}-${key}`, value]);
}
