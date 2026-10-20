# Section menu

The 56px row under the header that switches between the sections of a page: _Overview_, _Tasks_,
_Files_, _Settings_. Its items are 40px tall, quiet muted text until one is current, which takes
the selection tint and an accent edge. It never wraps: when the items don't fit, it scrolls
sideways.

## When not to use it

- For filters on a list: use a [pill row](pill-row.md).
- For the app's main navigation: that belongs in the [menu sheet](menu-sheet.md).
- For one or two sections: show them on one page instead.

## Links

Links (the default) navigate. The menu is a `<nav>`; name it with **`label`** so it reads apart
from the page's other navigation (_Project_), or point `aria-labelledby` at a heading. Give each
item the `href` of the section's own page, and set `current` on the section being shown, which
prints `aria-current="page"`. An item takes an optional **`count`**, in the mono face.

```blade example layout="phone"
<x-plinth::section-menu label="Project">
    <x-plinth::section-menu-item href="#" current>Overview</x-plinth::section-menu-item>
    <x-plinth::section-menu-item href="#" count="8">Tasks</x-plinth::section-menu-item>
    <x-plinth::section-menu-item href="#">Files</x-plinth::section-menu-item>
    <x-plinth::section-menu-item href="#">Settings</x-plinth::section-menu-item>
</x-plinth::section-menu>
```

## Buttons

Buttons switch the view in place, with no navigation (_Day_, _Week_, _Month_). Set **`nav`** to
false: the menu becomes a `<div role="group">`, and each item a toggle button that always prints
`aria-pressed`, `"true"` or `"false"`.

```blade example layout="phone"
<x-plinth::section-menu label="View" :nav="false">
    <x-plinth::section-menu-item>Day</x-plinth::section-menu-item>
    <x-plinth::section-menu-item current>Week</x-plinth::section-menu-item>
    <x-plinth::section-menu-item>Month</x-plinth::section-menu-item>
</x-plinth::section-menu>
```

The app owns which section is current and sets it. The current item takes the selection tint and
an accent edge, so colour is not its only cue; in forced colours it takes the system highlight.

## Disabled

A disabled button gets `disabled`; a disabled link loses its `href` and reads as a disabled link
(`role="link"`, `aria-disabled="true"`).

```blade example layout="phone"
<x-plinth::section-menu label="Account">
    <x-plinth::section-menu-item href="#" current>Profile</x-plinth::section-menu-item>
    <x-plinth::section-menu-item href="#" disabled>Billing</x-plinth::section-menu-item>
</x-plinth::section-menu>
```

## Many sections

The row scrolls at every width and snaps each item to its start. On a touch screen it shows no
scrollbar, so a cut-off item at the edge is the hint that there are more; with a mouse it shows a
thin one. Tab and a swipe scroll it too. When the current section starts out of view, the app
scrolls its item into view (`scrollIntoView({ inline: 'nearest', block: 'nearest' })`); Plinth
ships no script for it.

## Under the header

The menu sits under the [header](header.md) and shares its inline padding, so their content lines
up. Where it sits is the app's: to keep it in view as the page scrolls, make it sticky below the
header and add its height to the app's `scroll-padding-block-start`.

```css
.app-sections {
    position: sticky;
    inset-block-start: calc(var(--plinth-header-height) + env(safe-area-inset-top));
    z-index: var(--plinth-layer-sticky);
}
```

The row is `--plinth-section-menu-height` (56px) and its items `--plinth-section-menu-item-height`
(40px). An item never gets shorter than the 40px touch target, whatever the token says.

## Props

The menu and each item are their own components, so the app's attributes and listeners
(`wire:click`, `x-on:click`, `@click`, `onClick`) land on the item. The same names in every
layer; React takes the Vue props, with the label as `children`.

| Component | Prop     | Blade                           | Vue                          | React             | Default |
| --------- | -------- | ------------------------------- | ---------------------------- | ----------------- | ------- |
| menu      | label    | `label="Project"`               | `label="Project"`            | `label="Project"` | none    |
| menu      | nav      | `:nav="false"` for buttons      | `:nav="false"`               | `nav={false}`     | on      |
| item      | count    | `count="8"` or `:count="$open"` | `:count="8"`                 | `count={8}`       | none    |
| item      | href     | `href="/tasks"`                 | `href="/tasks"`              | `href="/tasks"`   | none    |
| item      | current  | `current` or `:current="$on"`   | `current` or `:current="on"` | `current={on}`    | off     |
| item      | disabled | `disabled`                      | `disabled`                   | `disabled`        | off     |
| item      | label    | the slot                        | the default slot             | `children`        | none    |

```blade tab="Blade"
<x-plinth::section-menu label="Project">
    <x-plinth::section-menu-item href="/overview" :current="request()->routeIs('overview')">Overview</x-plinth::section-menu-item>
    <x-plinth::section-menu-item href="/tasks" :count="$openTasks" :current="request()->routeIs('tasks')">Tasks</x-plinth::section-menu-item>
</x-plinth::section-menu>
```

```vue tab="Vue"
<PlinthSectionMenu label="View" :nav="false">
  <PlinthSectionMenuItem :current="view === 'day'" @click="view = 'day'">Day</PlinthSectionMenuItem>
  <PlinthSectionMenuItem :current="view === 'week'" @click="view = 'week'">Week</PlinthSectionMenuItem>
</PlinthSectionMenu>
```

```tsx tab="React"
import { PlinthSectionMenu, PlinthSectionMenuItem } from '@bdynamic/plinth/react';

<PlinthSectionMenu label="View" nav={false}>
    <PlinthSectionMenuItem current={view === 'day'} onClick={() => setView('day')}>
        Day
    </PlinthSectionMenuItem>
    <PlinthSectionMenuItem current={view === 'week'} onClick={() => setView('week')}>
        Week
    </PlinthSectionMenuItem>
</PlinthSectionMenu>;
```

## Accessibility

- As links, the menu is a named `<nav>` and the current item says so (`aria-current="page"`).
- As buttons, the menu is a named group and each item a toggle that says whether it is on
  (`aria-pressed`).
- The current item has an accent edge as well as its tint, so colour is not its only cue.
- Every item keeps a 40px touch target, and the focus ring stays inside the scrolling row.

The markup contract is at the top of
[`packages/css/src/components/section-menu.css`](../../packages/css/src/components/section-menu.css).
