/**
 * The source of Plinth's design tokens.
 *
 * Everything else (the CSS custom properties, the JS export, the Tailwind preset and theme) is
 * built from this file by `scripts/build.ts`. These are neutral defaults: a project brings its
 * brand by overriding the custom properties, never by editing a component.
 *
 * Semantic colours refer to the palette as `{scale.step}`. The build turns a reference into
 * `var(--plinth-palette-scale-step)` in CSS, so overriding a palette step re-colours everything
 * that uses it.
 */

export const palette = {
  neutral: {
    0: '#ffffff',
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  brand: {
    50: '#eff6ff',
    100: '#dbeafe',
    300: '#93c5fd',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    900: '#1e3a8a',
  },
  success: {
    100: '#dcfce7',
    200: '#bbf7d0',
    400: '#4ade80',
    600: '#16a34a',
    800: '#166534',
    950: '#052e16',
  },
  warning: {
    100: '#fef3c7',
    200: '#fde68a',
    400: '#fbbf24',
    500: '#f59e0b',
    800: '#92400e',
    950: '#451a03',
  },
  danger: {
    100: '#fee2e2',
    200: '#fecaca',
    400: '#f87171',
    600: '#dc2626',
    800: '#991b1b',
    950: '#450a0a',
  },
} as const;

export type Palette = typeof palette;
export type PaletteRef = {
  [Scale in keyof Palette]: `{${Scale}.${keyof Palette[Scale] & (string | number)}}`;
}[keyof Palette];

/** Semantic colours, one set per theme. Both themes must have the same keys. */
export const color = {
  light: {
    background: '{neutral.50}',
    surface: '{neutral.0}',
    'surface-muted': '{neutral.100}',
    text: '{neutral.900}',
    'text-muted': '{neutral.600}',
    border: '{neutral.200}',
    'border-strong': '{neutral.400}',
    brand: '{brand.600}',
    'brand-text': '{brand.700}',
    'on-brand': '{neutral.0}',
    focus: '{brand.600}',
    'neutral-surface': '{neutral.100}',
    'neutral-text': '{neutral.700}',
    'neutral-accent': '{neutral.500}',
    'success-surface': '{success.100}',
    'success-text': '{success.800}',
    'success-accent': '{success.600}',
    'warning-surface': '{warning.100}',
    'warning-text': '{warning.800}',
    'warning-accent': '{warning.500}',
    'danger-surface': '{danger.100}',
    'danger-text': '{danger.800}',
    'danger-accent': '{danger.600}',
  },
  dark: {
    background: '{neutral.950}',
    surface: '{neutral.900}',
    'surface-muted': '{neutral.800}',
    text: '{neutral.50}',
    'text-muted': '{neutral.400}',
    border: '{neutral.800}',
    'border-strong': '{neutral.600}',
    brand: '{brand.600}',
    'brand-text': '{brand.300}',
    'on-brand': '{neutral.0}',
    focus: '{brand.300}',
    'neutral-surface': '{neutral.800}',
    'neutral-text': '{neutral.200}',
    'neutral-accent': '{neutral.400}',
    'success-surface': '{success.950}',
    'success-text': '{success.200}',
    'success-accent': '{success.400}',
    'warning-surface': '{warning.950}',
    'warning-text': '{warning.200}',
    'warning-accent': '{warning.400}',
    'danger-surface': '{danger.950}',
    'danger-text': '{danger.200}',
    'danger-accent': '{danger.400}',
  },
} as const satisfies Record<'light' | 'dark', Record<string, PaletteRef>>;

export type Theme = keyof typeof color;
export type ColorName = keyof (typeof color)['light'];

export const font = {
  family: {
    sans: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
  },
  size: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  leading: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
  },
} as const;

/** Spacing steps. The key is the step on a 4px grid: `4` is 1rem; `0-5` is 0.125rem. */
export const space = {
  0: '0',
  '0-5': '0.125rem',
  1: '0.25rem',
  2: '0.5rem',
  3: '0.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  8: '2rem',
  10: '2.5rem',
  12: '3rem',
  16: '4rem',
} as const;

/** Fixed sizes. `touch` is the smallest touch target a component may have (40 × 40 px). */
export const size = {
  touch: '2.5rem',
} as const;

export const radius = {
  none: '0',
  sm: '0.25rem',
  md: '0.5rem',
  lg: '0.75rem',
  xl: '1rem',
  full: '9999px',
} as const;

/** Stacking order. Components use these, never a raw z-index. */
export const layer = {
  base: '0',
  raised: '10',
  dropdown: '100',
  sticky: '200',
  overlay: '300',
  modal: '400',
  toast: '500',
  tooltip: '600',
} as const;

/**
 * Breakpoints, mobile first: base rules are the phone, these add to them. Custom properties
 * cannot be used in media queries, so components write the values; they are exported for
 * documentation, JS and the Tailwind preset.
 */
export const breakpoint = {
  md: '768px',
  lg: '1280px',
} as const;

/** Motion. Durations collapse to 0ms under `prefers-reduced-motion: reduce`. */
export const motion = {
  duration: {
    fast: '120ms',
    normal: '200ms',
    slow: '320ms',
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    enter: 'cubic-bezier(0, 0, 0, 1)',
    exit: 'cubic-bezier(0.3, 0, 1, 1)',
  },
} as const;
