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
 * The custom properties. Light is the default; dark applies with `data-theme="dark"` (or the
 * `.dark` class) on any ancestor, and follows the system when no theme is set.
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

  return [
    banner,
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
  ]
    .join('\n\n')
    .concat('\n');
}

/**
 * A Tailwind preset (v3, or v4 through `@config`). Values are the custom properties, so a
 * project's overrides and the dark theme apply to the utilities too.
 */
export function buildTailwindPreset() {
  return {
    theme: {
      extend: {
        colors: { plinth: { ...vars.color, palette: vars.palette } },
        fontFamily: { plinth: vars.font.family.sans, 'plinth-mono': vars.font.family.mono },
        fontSize: prefixKeys(vars.font.size),
        fontWeight: prefixKeys(vars.font.weight),
        lineHeight: prefixKeys(vars.font.leading),
        spacing: prefixKeys(vars.space),
        borderRadius: prefixKeys(vars.radius),
        zIndex: prefixKeys(vars.layer),
        transitionDuration: prefixKeys(vars.motion.duration),
        transitionTimingFunction: prefixKeys(vars.motion.easing),
        screens: prefixKeys(breakpoint),
      },
    },
  };
}

function prefixKeys<T extends Record<string, string>>(group: T): Record<string, string> {
  return Object.fromEntries(Object.entries(group).map(([key, value]) => [`plinth-${key}`, value]));
}

/** The Tailwind preset as an ES module with its type declaration. */
export function buildTailwindPresetModule(): { js: string; dts: string } {
  const json = JSON.stringify(buildTailwindPreset(), null, 2);
  return {
    js: `${banner}\nexport default ${json};\n`,
    dts: `declare const preset: ${json};\nexport default preset;\n`,
  };
}

/**
 * The tokens as a Tailwind v4 `@theme`, for projects that configure Tailwind in CSS. Utilities
 * are namespaced: `bg-plinth-surface`, `p-plinth-4`, `rounded-plinth-md`, `plinth-md:…`.
 */
export function buildTailwindTheme(): string {
  const lines: Declarations = [
    ...Object.entries(vars.color).map(([key, value]): [string, string] => [
      `--color-plinth-${key}`,
      value,
    ]),
    ...Object.entries(vars.palette).flatMap(([scale, steps]) =>
      Object.entries(steps as Record<string, string>).map(([step, value]): [string, string] => [
        `--color-plinth-palette-${scale}-${step}`,
        value,
      ]),
    ),
    ['--font-plinth', vars.font.family.sans],
    ['--font-plinth-mono', vars.font.family.mono],
    ...themeEntries('text-plinth', vars.font.size),
    ...themeEntries('font-weight-plinth', vars.font.weight),
    ...themeEntries('leading-plinth', vars.font.leading),
    ...themeEntries('spacing-plinth', vars.space),
    ...themeEntries('radius-plinth', vars.radius),
    ...themeEntries('breakpoint-plinth', breakpoint),
    ...themeEntries('ease-plinth', vars.motion.easing),
  ];
  return `${banner}\n@theme inline {\n${lines.map(([n, v]) => `  ${n}: ${v};`).join('\n')}\n}\n`;
}

function themeEntries(namespace: string, group: Record<string, string>): Declarations {
  return Object.entries(group).map(([key, value]) => [`--${namespace}-${key}`, value]);
}
