# List card

A group of list rows on a raised surface, with an optional heading above it and a footer note
below it. Use it to group related rows on a settings page, in a sheet or on a detail screen.

## When not to use it

- For records with columns to compare, use the [data table](data-table.md).
- For a single row on its own, a [list row](list-row.md) needs no card.
- For content that isn't a list (a form, a paragraph), use the page's own layout.

```blade example layout="stack"
<x-plinth::list-card heading="Preferences" footer="Changes apply on every device you are signed in on.">
    <li><x-plinth::list-row href="#" chevron>Notifications</x-plinth::list-row></li>
    <li>
        <x-plinth::list-row href="#" chevron>
            Language
            <x-slot:trailing>English</x-slot:trailing>
        </x-plinth::list-row>
    </li>
</x-plinth::list-card>
```

## Rows

The slot holds the rows, each [list row](list-row.md) in its own `<li>`. Rows keep their own
roots, states and dividers: links, buttons, the current page and disabled rows all work as they
do on their own. The surface clips their hover and selection tints to its rounded corners, and
their focus ring is drawn inside the row, so it is never cut off.

```blade example layout="stack"
<x-plinth::list-card heading="Account" footer="Signing out ends the session on this device only.">
    <li>
        <x-plinth::list-row>
            Email
            <x-slot:trailing>ana@example.com</x-slot:trailing>
        </x-plinth::list-row>
    </li>
    <li><x-plinth::list-row href="#" current>Billing</x-plinth::list-row></li>
    <li><x-plinth::list-row button>Sign out</x-plinth::list-row></li>
</x-plinth::list-card>
```

## Naming the group

The heading is a real heading, so a screen reader user can jump to it from the page's outline.
It is an `<h2>` by default; set `heading-level` to `h3`–`h6` to fit the page's outline. To make
the card a landmark as well, wrap it in a `<section>` with the same name
(`<section aria-label="Preferences">`), and keep that label the same as the heading's text when
either changes.

## Depth

The card sits in the page, so it has a hairline edge and a surface step and no shadow (ADR 3:
shadows are for what floats, such as sheets and menus). A project that wants another look
overrides `--plinth-color-surface-raised`, `--plinth-color-border` or
`--plinth-radius-container`, with a light and a dark value for every colour:

```css label="resources/css/brand.css"
:root {
    --plinth-radius-container: 1rem;
    --plinth-color-surface-raised: light-dark(oklch(0.99 0.004 250), oklch(0.23 0.01 250));
}
```

## Markup contract

| Part                        | Element            | Required | What it is                                                            |
| --------------------------- | ------------------ | -------- | --------------------------------------------------------------------- |
| `.plinth-list-card`         | `<div>`            | yes      | The root; a project's classes and attributes land on it               |
| `.plinth-list-card-heading` | `<h2>`–`<h6>`      | no       | The heading above the surface                                         |
| `.plinth-list-card-list`    | `<ul role="list">` | yes      | The raised surface, with the list's margin, padding and bullets reset |
| `.plinth-list-card-footer`  | `<p>`              | no       | A note under the surface                                              |

## Props

The same names in every layer. React takes the Vue props, with the rows as `children`.

| Prop         | Blade                                           | Vue                     | React                   | Default |
| ------------ | ----------------------------------------------- | ----------------------- | ----------------------- | ------- |
| heading      | `heading="Preferences"`                         | `heading="Preferences"` | `heading="Preferences"` | none    |
| headingLevel | `heading-level="h3"` (or a `HeadingLevel` case) | `heading-level="h3"`    | `headingLevel="h3"`     | `h2`    |
| footer       | `footer="…"`                                    | `footer="…"`            | `footer="…"`            | none    |
| rows         | the slot, an `<li>` per row                     | the default slot        | `children`              | none    |

An unknown level falls back to `h2`. `class` (`className` in React), `id`, `data-*` and `aria-*`
reach the root `<div>`.

## Accessibility

- The list prints `role="list"`, which Safari needs to keep announcing a list without bullets.
- The heading is a real heading, at the level the page's outline needs.
- Row focus rings are drawn inside the rows, so the card's rounded corners never cut them off.
- Checked with axe in light and dark at 390, 768 and 1440px on every pull request.

The markup contract is at the top of
[`packages/css/src/components/list-card.css`](../../packages/css/src/components/list-card.css).
