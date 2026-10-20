# Component tokens

Only the values a project may need to tune for one component. They are built from semantic
tokens, so a brand's overrides still reach them.

## Sizes

<!-- tokens: component header -->

<!-- tokens: component data-table -->

<!-- tokens: component list-row -->

<!-- tokens: component pill -->

<!-- tokens: component sheet -->

<!-- tokens: component section-menu -->

## Callout

Each tone's background and hairline border: a faint, translucent tint of the tone's colour, so a
full-width callout stays quiet on any surface. Badges keep the stronger status surfaces.

The tints mix the tone's semantic colour (`--plinth-color-info` and the rest), so a brand that
overrides those on `:root` changes the tints too; an override on one section of a page changes
only the icon there. Only these per-tone tokens are meant to be overridden: the callout sets its
own `--plinth-callout-surface` and `-border` from them on every callout.

<!-- tokens: component callout -->

## Overriding them

Override one like any token, after Plinth's CSS. Give a colour a light and a dark value, as for
a [brand](branding.md): `light-dark()` picks the one for the theme the page is in.

```css label="resources/css/brand.css"
:root {
    --plinth-header-height: 4rem;
    --plinth-callout-info-border: light-dark(rgb(37 99 235 / 0.4), rgb(96 165 250 / 0.4));
}
```

Anything else about a component is the semantic tokens' job. If a project needs a value that has
no token, open an issue: a new component token is added to Plinth, not written into a project's
copy of the CSS.
