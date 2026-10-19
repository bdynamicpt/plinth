# Foundations

The tokens every component is built from: colour, type, spacing, sizes, radii, elevation, layers,
breakpoints and motion. They are written once and built to CSS custom properties, a JS export
and a Tailwind theme, so the tables on these pages come straight from the build.

## The pages

| Page                                                | What it covers                                                      |
| --------------------------------------------------- | ------------------------------------------------------------------- |
| [Colour](colour.md)                                 | surfaces, text, borders, the accent, the primary and status colours |
| [Typography](typography.md)                         | the typefaces, the type scale, weights, line heights and tracking   |
| [Spacing and sizes](spacing-and-sizes.md)           | the 4 px grid, control heights, the touch target, icons             |
| [Radii and elevation](radii-and-elevation.md)       | corners, borders and the shadows of what floats                     |
| [Layers and breakpoints](layers-and-breakpoints.md) | stacking order and the two widths the layout changes at             |
| [Motion](motion.md)                                 | durations and easing, and reduced motion                            |
| [Focus ring](focus-ring.md)                         | the ring every focusable element shows                              |
| [Component tokens](component-tokens.md)             | the values a project may tune for one component                     |

## How to read them

Each page shows the semantic tokens first, which are what components use and what a brand
overrides, then the primitives they are built from. Colours show their light and dark values. See
[Token tiers](token-tiers.md) for what the tiers are for.

The look these tokens give is decided in
[ADR 3](../../docs/adr/0003-visual-direction.md): dense and quiet, dark first, Geist and Geist
Mono, hairline borders, and one accent.
