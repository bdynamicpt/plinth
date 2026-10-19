# Icon

A project's own SVG, sized by Plinth (16, 20 or 24px) and coloured by the text around it. Plinth
ships no icons: pass an inline SVG, or a sprite `<use>`, drawn with `currentColor`.

## When not to use it

- As a button: an icon that does something is an [icon button](icon-button.md), which brings the
  focus ring, the touch target and the accessible name.
- As the only way to say something important. Put the words next to it, or give it a `label`.
- For a status: that is a [badge](badge.md), which has words.

## Sizes

**sm** (16px) inline with small text and in dense rows, **md** (20px, the default) next to body
text and in controls, **lg** (24px) on its own or in a header.

```blade example
<x-plinth::icon size="sm"><x-site.glyph name="check" /></x-plinth::icon>
<x-plinth::icon><x-site.glyph name="check" /></x-plinth::icon>
<x-plinth::icon size="lg"><x-site.glyph name="check" /></x-plinth::icon>
```

## Colour

Plinth sets no fill or stroke, so outline and filled icon sets both keep theirs. Draw the SVG with
`currentColor` and the icon takes the colour of the text around it.

```blade example
<span>
    <x-plinth::icon size="sm"><x-site.glyph name="check" /></x-plinth::icon>
    Invoice paid
</span>
```

## Decorative or meaningful

An icon is **decorative** by default and hidden from screen readers (`aria-hidden="true"`): most
icons sit next to words that already say what they mean. Give it a `label` (or an `aria-label`)
only when the icon carries meaning that nothing next to it says; it then becomes an image with
that name.

```blade example
<x-plinth::icon label="Warning"><x-site.glyph name="alert" /></x-plinth::icon>
```

## Direction

Set `mirror` on icons that point a direction (arrows, chevrons, back, send), so they flip in
right-to-left text; it changes nothing in left-to-right text.

```blade example
<x-plinth::icon mirror><x-site.glyph name="arrow-right" /></x-plinth::icon>
<span dir="rtl"><x-plinth::icon mirror><x-site.glyph name="arrow-right" /></x-plinth::icon></span>
```

## Props

The same names in every layer. React takes the Vue props, with the SVG as `children`.

| Prop   | Blade                                  | Vue               | React             | Default |
| ------ | -------------------------------------- | ----------------- | ----------------- | ------- |
| size   | `size="lg"` (or a `Size` case)         | `size="lg"`       | `size="lg"`       | `md`    |
| label  | `label="Warning"` (or an `aria-label`) | `label="Warning"` | `label="Warning"` | none    |
| mirror | `mirror`                               | `mirror`          | `mirror`          | off     |
| SVG    | the slot                               | the default slot  | `children`        | none    |

Extra attributes (`class`, `id`, `data-*`) reach the `<span>`; in React, `className` and `ref` do.

## Accessibility

- Decorative by default: `aria-hidden="true"`, so screen readers skip it.
- With a `label`, the span gets `role="img"` and the label as `aria-label`, and the SVG inside is
  presentational. A blank label leaves the icon decorative.
- It is not focusable and has no touch target; put it in a button or a link to make it do
  something.
- In forced-colours mode the icon takes the system's text colour, since it draws with
  `currentColor`.

The markup contract is at the top of
[`packages/css/src/components/icon.css`](../../packages/css/src/components/icon.css).
