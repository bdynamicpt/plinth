import {
  breakpoint,
  color,
  font,
  layer,
  motion,
  palette,
  radius,
  size,
  space,
  type ColorName,
  type PaletteRef,
  type Theme,
} from './tokens.ts';

export * from './tokens.ts';

/** Every custom property Plinth defines starts with this. */
export const prefix = 'plinth';

/** `var(--plinth-…)` for a token path, e.g. `cssVar('space', 4)`. */
export function cssVar(...path: (string | number)[]): string {
  return `var(${cssVarName(...path)})`;
}

/** `--plinth-…` for a token path, e.g. `cssVarName('color', 'text')`. */
export function cssVarName(...path: (string | number)[]): string {
  return `--${[prefix, ...path].join('-')}`;
}

const refPattern = /^\{([a-z]+)\.([a-z0-9-]+)\}$/;

/** Splits `{neutral.900}` into `['neutral', '900']`, or throws if it is not a palette reference. */
export function parseRef(ref: string): [keyof typeof palette, string] {
  const match = refPattern.exec(ref);
  if (!match || !(match[1]! in palette)) {
    throw new Error(`Not a palette reference: ${ref}`);
  }
  const [, scale, step] = match as unknown as [string, keyof typeof palette, string];
  if (!(step in palette[scale])) {
    throw new Error(`Unknown palette step: ${ref}`);
  }
  return [scale, step];
}

/** The hex value a palette reference points to. */
export function resolveRef(ref: PaletteRef | string): string {
  const [scale, step] = parseRef(ref);
  return (palette[scale] as Record<string, string>)[step]!;
}

/** Semantic colours of a theme with their references resolved to hex values. */
export function resolvedColors(theme: Theme): Record<ColorName, string> {
  return Object.fromEntries(
    Object.entries(color[theme]).map(([name, ref]) => [name, resolveRef(ref)]),
  ) as Record<ColorName, string>;
}

function mapVars<T extends Record<string | number, unknown>>(
  group: T,
  ...path: string[]
): Record<keyof T, string> {
  return Object.fromEntries(Object.keys(group).map((key) => [key, cssVar(...path, key)])) as Record<
    keyof T,
    string
  >;
}

/**
 * The same shape as the tokens, but every value is the `var(--plinth-…)` that holds it. Use these
 * in JS so a project's overrides still apply.
 */
export const vars = {
  palette: Object.fromEntries(
    Object.entries(palette).map(([scale, steps]) => [scale, mapVars(steps, 'palette', scale)]),
  ) as { [Scale in keyof typeof palette]: Record<keyof (typeof palette)[Scale], string> },
  color: mapVars(color.light, 'color'),
  font: {
    family: mapVars(font.family, 'font'),
    size: mapVars(font.size, 'font-size'),
    weight: mapVars(font.weight, 'font-weight'),
    leading: mapVars(font.leading, 'leading'),
  },
  space: mapVars(space, 'space'),
  size: mapVars(size, 'size'),
  radius: mapVars(radius, 'radius'),
  layer: mapVars(layer, 'layer'),
  breakpoint: mapVars(breakpoint, 'breakpoint'),
  motion: {
    duration: mapVars(motion.duration, 'duration'),
    easing: mapVars(motion.easing, 'easing'),
  },
};
