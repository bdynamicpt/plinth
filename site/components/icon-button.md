# Icon button

A button with only an icon, for places where space is tight and the action is familiar: a toolbar,
a header, the end of a table row, closing a sheet. It is a [button](button.md) in every way
(variants, sizes, states), just square and without visible text.

## When not to use it

- When people would have to guess what the icon means. Use a button with a label, or a label and a
  leading icon: a guessed icon costs more time than the space it saves.
- For the one main action of a page that has room for a label.
- To go somewhere in a menu or a list: that is a [list row](list-row.md).

Use an icon button only when the icon is **universally understood** in its place: close (×),
more (⋯), search, edit, a star for favourite.

## The label

Every icon button needs a **`label`**. It is the button's only name: screen readers read it, voice
control uses it, and it is the text to show in a tooltip (pass it as `title` too if you want the
browser's). Blade refuses to render an icon button without one, Vue warns, and React's types
require the prop; in Vue and React, make sure it is not blank.

```blade example
<x-plinth::icon-button label="Search"><x-site.glyph name="search" /></x-plinth::icon-button>
<x-plinth::icon-button label="More actions"><x-site.glyph name="more" /></x-plinth::icon-button>
<x-plinth::icon-button label="Close" variant="secondary"><x-site.glyph name="close" /></x-plinth::icon-button>
```

## Variants

**ghost** is the default, because icon buttons usually come in groups and repeat (toolbars, rows),
and quiet ones keep a dense screen calm. The other variants mean what they mean on a
[button](button.md): **secondary** for an icon action that needs an edge, such as closing a
dialog; **primary** or **accent** rarely, for the one main action in a compact place;
**danger-ghost** for removing an item from a row.

```blade example
<x-plinth::icon-button label="Notifications"><x-site.glyph name="bell" /></x-plinth::icon-button>
<x-plinth::icon-button label="Close" variant="secondary"><x-site.glyph name="close" /></x-plinth::icon-button>
<x-plinth::icon-button label="New project" variant="primary"><x-site.glyph name="plus" /></x-plinth::icon-button>
<x-plinth::icon-button label="Remove" variant="danger-ghost"><x-site.glyph name="close" /></x-plinth::icon-button>
```

## Toggles

Set `pressed` to make it a toggle, such as favourite, bold or mute: `true` or `false` prints
`aria-pressed`, so screen readers announce the state, and pressed shows the selection tint. Keep
the label the same in both states (_Notifications_), since `aria-pressed` already says whether it
is on.

```blade example
<x-plinth::icon-button label="Notifications" :pressed="false"><x-site.glyph name="bell" /></x-plinth::icon-button>
<x-plinth::icon-button label="Notifications" :pressed="true"><x-site.glyph name="bell" /></x-plinth::icon-button>
```

## Sizes and touch

28, 32 (the default) and 40px squares. On a touch screen every size keeps a 40px touch target, so
small icon buttons in a row are still easy to hit; leave a little space between them all the same.

```blade example
<x-plinth::icon-button label="Search" variant="secondary" size="sm"><x-site.glyph name="search" /></x-plinth::icon-button>
<x-plinth::icon-button label="Search" variant="secondary"><x-site.glyph name="search" /></x-plinth::icon-button>
<x-plinth::icon-button label="Search" variant="secondary" size="lg"><x-site.glyph name="search" /></x-plinth::icon-button>
```

## Links, states and direction

With an `href` it is a link (for example _Next page_). `disabled` and `busy` work as on the
button. Set `mirror` on an icon that points a direction, so it flips in right-to-left text.

```blade example
<x-plinth::icon-button label="Next page" href="#" mirror><x-site.glyph name="arrow-right" /></x-plinth::icon-button>
<x-plinth::icon-button label="Download" disabled><x-site.glyph name="download" /></x-plinth::icon-button>
<x-plinth::icon-button label="Download" busy><x-site.glyph name="download" /></x-plinth::icon-button>
```

## Props

The same names in every layer. React takes the Vue props, with the icon as `children`.

| Prop     | Blade                                             | Vue                        | React                 | Default |
| -------- | ------------------------------------------------- | -------------------------- | --------------------- | ------- |
| label    | `label="Close"` (or an `aria-label`)              | `label="Close"`            | `label="Close"`       | none    |
| variant  | `variant="secondary"` (or a `ButtonVariant` case) | `variant="secondary"`      | `variant="secondary"` | `ghost` |
| size     | `size="sm"` (or a `Size` case)                    | `size="sm"`                | `size="sm"`           | `md`    |
| href     | `href="/page/2"`, makes it a link                 | `href="/page/2"`           | `href="/page/2"`      | none    |
| disabled | `disabled`                                        | `disabled`                 | `disabled`            | off     |
| busy     | `busy` or `:busy="$saving"`                       | `busy` or `:busy="saving"` | `busy={saving}`       | off     |
| pressed  | `:pressed="$favourite"`, a toggle                 | `:pressed="favourite"`     | `pressed={favourite}` | not set |
| mirror   | `mirror`                                          | `mirror`                   | `mirror`              | off     |
| icon     | the slot                                          | the default slot           | `children`            | none    |

`class`, `wire:*`, `x-*` and `@click` reach the button or link; in React, `className`, `onClick`,
`ref` and every other prop do.

```blade tab="Blade"
<x-plinth::icon-button label="Close" variant="secondary" wire:click="close">
    <svg>…</svg>
</x-plinth::icon-button>
```

```vue tab="Vue"
<PlinthIconButton label="Favourite" :pressed="isFavourite" @click="toggle">
  <svg>…</svg>
</PlinthIconButton>
```

```tsx tab="React"
import { PlinthIconButton } from '@bdynamic/plinth/react';

<PlinthIconButton label="Favourite" pressed={favourite} onClick={toggle}>
    <StarIcon />
</PlinthIconButton>;
```

## Accessibility

- The `label` is the accessible name, printed as `aria-label`; the icon inside is hidden from
  screen readers.
- A toggle prints `aria-pressed="true"` or `"false"`, so its state is announced; without
  `pressed` there is no `aria-pressed`.
- Busy sets `aria-busy` and `aria-disabled` and keeps focus; a disabled link has no `href`,
  `role="link"` and `aria-disabled="true"`.
- The focus ring shows on `:focus-visible`, offset on the filled variants.
- Every size keeps a 40 × 40px touch target on a touch screen.

The markup contract is in
[`packages/css/src/components/button.css`](../../packages/css/src/components/button.css), under
the icon button.
