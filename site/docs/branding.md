# Branding your project

Plinth ships a neutral, dark-first default. Your project brings its brand by overriding a handful
of semantic tokens, after Plinth's CSS. You never fork a component.

## Override the semantic tokens

Plinth's own custom properties are inside `@layer plinth`. Write yours outside any layer, in a
stylesheet loaded after Plinth's, and they win with no `!important`. Give every colour a light
and a dark value: `light-dark()` picks the one for the theme the page is in.

```css label="resources/css/brand.css"
:root {
    --plinth-color-accent: light-dark(#0f766e, #2dd4bf);
    --plinth-color-accent-hover: light-dark(#115e59, #5eead4);
    --plinth-color-accent-active: light-dark(#134e4a, #99f6e4);
    --plinth-color-accent-text: light-dark(#115e59, #5eead4);
    --plinth-color-on-accent: light-dark(#fff, #042f2e);
    --plinth-color-focus-ring: light-dark(#0f766e, #5eead4);
    --plinth-radius-pill: 0.25rem;
    --plinth-font-family-body: 'Your Font', system-ui, sans-serif;
}
```

The same accent, before and after:

<!-- example: brand -->

> [!WARNING]
> Override semantic tokens, never primitives. The `--plinth-ref-*` primitives only feed the
> semantic tier; components never read them, so changing one does nothing you can rely on.

## Which tier to change

| Tier      | Example                         | Override it?               |
| --------- | ------------------------------- | -------------------------- |
| Primitive | `--plinth-ref-color-neutral-50` | No                         |
| Semantic  | `--plinth-color-surface`        | Yes: this is your brand    |
| Component | `--plinth-header-height`        | Only to tune one component |

See [Token tiers](token-tiers.md) for what each tier is for, and [Colour](colour.md) for every
semantic colour.

## What a brand usually changes

- **The accent:** `accent`, its `hover` and `active` steps, `accent-text` for links and
  `on-accent` for text on an accent fill. Keep `focus-ring` close to it.
- **The primary button:** Plinth's is inverted neutral (light on dark, dark on light). A brand
  that wants a coloured one sets `primary`, its steps and `on-primary`.
- **The shape:** `radius-control`, `radius-container` and `radius-pill`.
- **The type:** `font-family-body` and `font-family-mono`. A project that sets its own typefaces
  loads its own font files and can leave out Plinth's `fonts.css`.
- **The surfaces and text**, for a warmer or cooler neutral: `surface`, `surface-raised`,
  `surface-sunken`, `text`, `text-muted`, `border` and `divider`.

Text colours must still meet WCAG AA (4.5:1) on the surfaces, in light and dark.

## A dark value for every colour

Dark follows the system, and a page can force either theme ([Dark mode](dark-mode.md)). A brand
that sets only light colours leaves dark pages with light accents on dark surfaces, so give each
colour both values. `light-dark()` keeps them on one line; separate rules work too:

```css label="resources/css/brand.css"
:root {
    --plinth-color-accent: #0f766e;
}

[data-theme='dark'],
.dark {
    --plinth-color-accent: #2dd4bf;
}

@media (prefers-color-scheme: dark) {
    :root:not([data-theme='light'], .light) {
        --plinth-color-accent: #2dd4bf;
    }
}
```

## See it before you ship

Switch **Brand** in Storybook's toolbar to the made-up example brand: every component, in light
and dark, with its overrides. Its file,
[`storybook/brands/example.css`](../../storybook/brands/example.css), is a complete brand to
start from.
