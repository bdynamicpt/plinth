# Colour

Neutral surfaces with a slight cool tint, borders that are the text colour at low opacity, three
levels of text and one accent. Dark is designed first; every colour has a light and a dark value.

## Semantic colours

What components use, and what a brand overrides. Text colours meet WCAG AA (4.5:1) on the
surfaces in both themes, which the token tests check.

<!-- tokens: semantic color -->

## How they are used

- **Surfaces** step up in small increments: `surface` for the page, `surface-raised` for what
  sits on it, `surface-sunken` for wells such as code, and `surface-hover` for hover.
- **Text** has three levels: `text`, `text-muted` for secondary text and `text-subtle` for
  placeholders, timestamps and disabled labels.
- **Borders and dividers** are the text colour at low opacity, so one token works on every
  surface.
- **The primary** is inverted neutral inside an app: light on dark, dark on light. The **accent**
  marks state there (focus, links, the active item, the selected row) and fills the main action
  only on marketing pages, through the button's `accent` variant.
- **Status colours** (info, success, warning, danger) each come as a colour, a tinted surface
  and a text colour. Colour is never the only signal: a status also says what it is in words or
  with its own icon shape.

## Built from

The primitive ramps, named by step (`--plinth-ref-color-*`). Components never use these directly.

### Neutral

<!-- tokens: primitive ref color neutral -->

### Brand

<!-- tokens: primitive ref color brand -->

### Status

<!-- tokens: primitive ref color green -->

<!-- tokens: primitive ref color amber -->

<!-- tokens: primitive ref color red -->

### Translucent

<!-- tokens: primitive ref color ink-alpha -->

<!-- tokens: primitive ref color chalk-alpha -->

<!-- tokens: primitive ref color black-alpha -->

<!-- tokens: primitive ref color white-alpha -->
