/**
 * Stylelint for packages/css, the component stylesheets. Beyond the standard config and the
 * property order, it enforces Plinth's rules: tokens only (no raw colours, spacing, radii or
 * z-index, and no primitives), no !important, logical properties, mobile-first media queries and plinth-* classes.
 */
const lengthUnits = ['px', 'rem', 'em', 'vw', 'vh'];

/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recess-order'],
  rules: {
    'declaration-no-important': true,
    'color-no-hex': true,
    'color-named': 'never',
    'function-disallowed-list': [
      'rgb',
      'rgba',
      'hsl',
      'hsla',
      'hwb',
      'lab',
      'lch',
      'oklab',
      'oklch',
      'color',
      'color-mix',
    ],
    'declaration-property-value-allowed-list': {
      'z-index': ['/^var\\(--plinth-layer-[a-z]+\\)$/', 'auto'],
    },
    'declaration-property-unit-disallowed-list': {
      '/^(margin|padding|gap|row-gap|column-gap|inset|font-size|line-height|border-radius|letter-spacing)/':
        lengthUnits,
    },
    'property-disallowed-list': [
      '/^(margin|padding|border)-(left|right|top|bottom)/',
      'left',
      'right',
      'top',
      'bottom',
      'width',
      'height',
      'min-width',
      'max-width',
      'min-height',
      'max-height',
    ],
    'declaration-property-value-disallowed-list': {
      // Components use semantic and component tokens, never primitives (--plinth-ref-*).
      '/.*/': ['/var\\(--plinth-ref-/'],
      'text-align': ['left', 'right'],
      float: ['left', 'right'],
      clear: ['left', 'right'],
    },
    'media-feature-name-allowed-list': [
      'min-width',
      'prefers-reduced-motion',
      'prefers-color-scheme',
      'forced-colors',
      'hover',
      'pointer',
    ],
    'media-feature-range-notation': 'prefix',
    'selector-class-pattern': [
      '^(plinth-[a-z0-9]+(-[a-z0-9]+)*|is-[a-z0-9]+(-[a-z0-9]+)*)$',
      { message: 'Use plinth-component, plinth-component-part or an is-* state class' },
    ],
    'custom-property-pattern': [
      '^plinth-[a-z0-9]+(-[a-z0-9]+)*$',
      { message: 'Custom properties start with --plinth-' },
    ],
  },
};
