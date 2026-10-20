# List row

One row of a list or a sheet: a setting, a person, a section of the app. It has a title, an
optional description under it, a leading slot for an icon or an avatar, and a trailing slot for a
value, a badge or a control. It is 44px tall at least, and grows with a description.

## When not to use it

- For records with several fields to compare side by side, use the [data table](data-table.md).
- For the main action of a screen, use a [button](button.md): a row is one item among many.
- For a row of filters or segments, use the [pill row](pill-row.md).

## Static, link or button

The row's root is the element the app talks to, so `href`, `wire:click` and `x-on:click` land on
it (ADR 2):

- a row that only shows something is a `<div>`;
- a row that navigates gets an **`href`** and becomes an `<a>`;
- a row that acts (sign out, open a sheet) gets **`button`** and becomes a `<button type="button">`.

Set **`chevron`** on a row that opens another page or a sheet. It points the other way in
right-to-left text.

```blade example layout="stack"
<x-plinth::list-card>
    <li><x-plinth::list-row description="Monthly, by email">Invoice summary</x-plinth::list-row></li>
    <li><x-plinth::list-row href="#" chevron>Notifications</x-plinth::list-row></li>
    <li><x-plinth::list-row button>Sign out</x-plinth::list-row></li>
</x-plinth::list-card>
```

## Leading and trailing

The leading slot takes an icon or an avatar. When the avatar shows the person in the title, make
it **decorative**, so screen readers don't read the name twice. The trailing slot takes a value
(_English_), a badge or, in a static row, a control.

```blade example layout="stack"
<x-plinth::list-card>
    <li>
        <x-plinth::list-row description="ana@example.com">
            <x-slot:leading><x-plinth::avatar name="Ana Lima" size="sm" decorative /></x-slot:leading>
            Ana Lima
            <x-slot:trailing><x-plinth::badge tone="success" dot>Online</x-plinth::badge></x-slot:trailing>
        </x-plinth::list-row>
    </li>
    <li>
        <x-plinth::list-row href="#" chevron>
            <x-slot:leading><x-plinth::icon><x-site.glyph name="window" /></x-plinth::icon></x-slot:leading>
            Language
            <x-slot:trailing>English</x-slot:trailing>
        </x-plinth::list-row>
    </li>
    <li>
        <x-plinth::list-row>
            Invoices
            <x-slot:trailing><x-plinth::badge tone="warning">3 due</x-plinth::badge></x-slot:trailing>
        </x-plinth::list-row>
    </li>
</x-plinth::list-card>
```

A link or a button can't hold another control, so a row with a switch or an icon button in its
trailing slot is a static row. Give that control its own accessible name, one that says which row
it belongs to (_More actions for Rui Costa_).

```blade example layout="stack"
<x-plinth::list-card>
    <li>
        <x-plinth::list-row description="Owner">
            <x-slot:leading><x-plinth::avatar name="Rui Costa" size="sm" decorative /></x-slot:leading>
            Rui Costa
            <x-slot:trailing>
                <x-plinth::icon-button label="More actions for Rui Costa"><x-site.glyph name="more" /></x-plinth::icon-button>
            </x-slot:trailing>
        </x-plinth::list-row>
    </li>
</x-plinth::list-card>
```

## States

- **Current:** set `current` on the link row for the page being shown (it prints
  `aria-current="page"`); the app decides which one it is. It takes the selection tint and a
  heavier title. A button row doesn't print it, since a button is not a page.
- **Disabled:** a disabled button row gets `disabled`; a disabled link row loses its `href` and
  reads as a disabled link (`role="link"`, `aria-disabled="true"`).

```blade example layout="stack"
<x-plinth::list-card>
    <li><x-plinth::list-row href="#" current>Overview</x-plinth::list-row></li>
    <li><x-plinth::list-row button disabled>Export</x-plinth::list-row></li>
    <li><x-plinth::list-row href="#" chevron disabled>Billing</x-plinth::list-row></li>
</x-plinth::list-card>
```

## In a list

Put rows next to each other, or each as the direct child of its own `<li>` in a `<ul>`, and a
hairline divider (`--plinth-color-divider`) sits between them; a wrapper element between the
`<li>` and the row drops it. The [list card](list-card.md) resets the list for you; on your own,
reset it (`margin`, `padding`, `list-style: none`) and add `role="list"`, which Safari needs to
keep announcing a list without bullets. Long titles and descriptions wrap. The trailing slot keeps
its width up to half the row, so a long title wraps before a short value does.

## Routing

Plinth never routes. A link row is a plain `<a href>`, so in a single-page app hand it your
router's link: with Vue Router, `<RouterLink custom v-slot="{ href, navigate, isActive }">` around
`<PlinthListRow :href="href" :current="isActive" @click="navigate">`; in Livewire, add
`wire:navigate`. The listener and the attribute land on the row's root.

## Props

The same names in every layer. React takes the Vue props, with the title as `children` and the
slots as props that take a node.

| Prop        | Blade                               | Vue                               | React                             | Default |
| ----------- | ----------------------------------- | --------------------------------- | --------------------------------- | ------- |
| description | `description="Monthly, by email"`   | `description="Monthly, by email"` | `description="Monthly, by email"` | none    |
| href        | `href="/settings"`, makes it a link | `href="/settings"`                | `href="/settings"`                | none    |
| button      | `button`, makes it a button         | `button`                          | `button`                          | off     |
| chevron     | `chevron`                           | `chevron`                         | `chevron`                         | off     |
| current     | `current` or `:current="$active"`   | `current` or `:current="active"`  | `current={active}`                | off     |
| disabled    | `disabled`                          | `disabled`                        | `disabled`                        | off     |
| leading     | `<x-slot:leading>`                  | `#leading` slot                   | `leading` (a node)                | none    |
| trailing    | `<x-slot:trailing>`                 | `#trailing` slot                  | `trailing` (a node)               | none    |
| title       | the slot                            | the default slot                  | `children`                        | none    |

Extra attributes and listeners (`wire:click`, `@click`, `onClick`) reach the root: the `<a>`, the
`<button>` or the `<div>`.

```blade tab="Blade"
<x-plinth::list-row :href="route('settings.language')" chevron wire:navigate>
    Language
    <x-slot:trailing>English</x-slot:trailing>
</x-plinth::list-row>

<x-plinth::list-row button wire:click="signOut">Sign out</x-plinth::list-row>
```

```vue tab="Vue"
<PlinthListRow href="/overview" :current="route.name === 'overview'">Overview</PlinthListRow>

<PlinthListRow button description="Email and push" @click="openNotifications">
  Notifications
</PlinthListRow>
```

```tsx tab="React"
import { PlinthListRow } from '@bdynamic/plinth/react';

<PlinthListRow href="/settings/language" chevron trailing="English">
    Language
</PlinthListRow>;

<PlinthListRow button description="Email and push" onClick={openNotifications}>
    Notifications
</PlinthListRow>;
```

## Accessibility

- The root is the native element for what the row does: a `<div>`, an `<a>` or a
  `<button type="button">`.
- The current row prints `aria-current="page"`; a disabled link row has no `href`, `role="link"`
  and `aria-disabled="true"`.
- The focus ring is drawn inside the row, so a scrolling sheet or a card doesn't cut it off.
- The minimum height is `--plinth-list-row-height` (44px), above the 40px touch target.
- A decorative avatar is hidden from screen readers, so a person's name isn't read twice.
- Checked with axe in light and dark at 390, 768 and 1440px on every pull request.

The markup contract is at the top of
[`packages/css/src/components/list-row.css`](../../packages/css/src/components/list-row.css).
