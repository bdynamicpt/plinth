# Token tiers

Plinth's tokens come in three tiers. Components read only the top two, and projects override
only the middle one.

| Tier      | Custom properties               | Used by                                                |
| --------- | ------------------------------- | ------------------------------------------------------ |
| Primitive | `--plinth-ref-color-neutral-50` | semantic tokens only: the raw scales, named by value   |
| Semantic  | `--plinth-color-surface`        | components, named by role; **projects override these** |
| Component | `--plinth-header-height`        | one component, for values a project may tune           |

## Primitives

The raw scales: neutral and accent colour ramps in oklch, the 4 px spacing grid, font sizes,
radii, durations. They are named by value (`neutral-50`, `space-4`), so they say nothing about
where they are used. Stylelint rejects them in component CSS.

## Semantic tokens

Named by role: `surface`, `text-muted`, `border`, `accent`, `radius-control`, `control-md`. Each
colour has a light and a dark value, built from primitives. This is the tier components use and
the tier a brand overrides. See [Foundations](foundations.md) for all of them.

## Component tokens

A few values a project may need to tune for one component, such as the header's height or a side
sheet's width. They are built from semantic tokens. See
[Component tokens](component-tokens.md).

## How they are built

The tokens are DTCG JSON in `packages/tokens/tokens/`
([ADR 1](../../docs/adr/0001-design-tokens-in-dtcg-built-with-style-dictionary.md)), built with
Style Dictionary to:

- CSS custom properties (`@bdynamic/plinth/tokens.css`, also inside the full stylesheet);
- a JS and TypeScript export (`@bdynamic/plinth/tokens`), with each token's tier, value and dark
  value;
- a Tailwind v4 theme (`@bdynamic/plinth/tailwind.css`).

The CSS build rejects any `var(--plinth-*)` in a component that isn't a token, and the token
tests check that text colours meet WCAG AA on the surfaces in both themes.
