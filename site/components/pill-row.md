# Pill row

A row of pills for filters, segments or the sub-pages of a section. Each pill has a label and an
optional count. On a phone the row scrolls sideways, with no visible scrollbar, and snaps to the
pills; from 768px it wraps onto more lines.

## When not to use it

- To switch between the main sections of a page under the header: use the
  [section menu](section-menu.md).
- For an action: use a [button](button.md). A pill selects or navigates; it doesn't do.
- For a status that does nothing when pressed: use a [badge](badge.md).

## Filters

Filters are buttons. A button pill is a toggle and always prints `aria-pressed`, `"true"` or
`"false"`, so a screen reader announces which ones are on. The row is a `<div role="group">`; name
it with **`label`** (_Status_), or point `aria-labelledby` at a heading. One pill or several can be
on: the app decides.

```blade example
<x-plinth::pill-row label="Status">
    <x-plinth::pill count="24" selected>All</x-plinth::pill>
    <x-plinth::pill count="18">Paid</x-plinth::pill>
    <x-plinth::pill count="5">Drafts</x-plinth::pill>
    <x-plinth::pill count="1">Overdue</x-plinth::pill>
</x-plinth::pill-row>
```

## Navigation

Navigation pills are links. Set **`nav`** on the row to make it a `<nav>`, give each pill an
`href`, and set `selected` on the one for the page being shown, which prints
`aria-current="page"`. Name the `<nav>` too, with a `label` that tells it apart from the page's
other navigation (_Project sections_).

```blade example
<x-plinth::pill-row label="Project sections" nav>
    <x-plinth::pill href="#" selected>Overview</x-plinth::pill>
    <x-plinth::pill href="#" count="8">Tasks</x-plinth::pill>
    <x-plinth::pill href="#">Files</x-plinth::pill>
</x-plinth::pill-row>
```

Tab moves through the pills, and Space or Enter toggles a filter. The selected pill takes the
selection tint with an accent edge, where the others have a neutral one; in forced colours it takes
the system highlight.

## Disabled

A disabled button pill gets `disabled`; a disabled link pill loses its `href` and reads as a
disabled link (`role="link"`, `aria-disabled="true"`).

```blade example
<x-plinth::pill-row label="Team">
    <x-plinth::pill selected>Everyone</x-plinth::pill>
    <x-plinth::pill disabled>Guests</x-plinth::pill>
</x-plinth::pill-row>
```

## Many pills

The row scrolls on a phone and snaps each pill to its start. It shows no scrollbar, so a cut-off
pill at the edge is the hint that there are more; Tab, a swipe or Shift with the wheel scrolls it.
Its own small padding keeps the focus ring and the 40px touch target of the pills inside the
scrolling area. To let the row run to the edges of the screen, give it the page's gutter as
`padding-inline` and the same negative `margin-inline`.

A pill is `--plinth-pill-height` (32px) tall and at least 40px wide, and keeps a 40px hit area on a
touch screen; the row's padding grows to fit it when a project makes pills shorter.

## Props

The row and each pill are their own components, so the app's attributes and listeners
(`wire:click`, `x-on:click`, `@click`, `onClick`) land on the pill. The same names in every layer;
React takes the Vue props, with the label as `children`. Other attributes reach each root (the
row's `<div>` or `<nav>`, the pill's `<button>` or `<a>`), and in React so do `className`, added
to Plinth's class, and the `ref`.

| Component | Prop     | Blade                            | Vue                            | React            | Default |
| --------- | -------- | -------------------------------- | ------------------------------ | ---------------- | ------- |
| pill row  | label    | `label="Status"`                 | `label="Status"`               | `label="Status"` | none    |
| pill row  | nav      | `nav`, makes it a `<nav>`        | `nav`                          | `nav`            | off     |
| pill      | count    | `count="5"` or `:count="$open"`  | `:count="5"`                   | `count={5}`      | none    |
| pill      | href     | `href="/tasks"`, makes it a link | `href="/tasks"`                | `href="/tasks"`  | none    |
| pill      | selected | `selected` or `:selected="$on"`  | `selected` or `:selected="on"` | `selected={on}`  | off     |
| pill      | disabled | `disabled`                       | `disabled`                     | `disabled`       | off     |
| pill      | label    | the slot                         | the default slot               | `children`       | none    |

```blade tab="Blade"
<x-plinth::pill-row label="Status">
    @foreach ($statuses as $status)
        <x-plinth::pill
            :count="$status->count"
            :selected="$filter === $status->value"
            wire:click="$set('filter', '{{ $status->value }}')"
        >{{ $status->label }}</x-plinth::pill>
    @endforeach
</x-plinth::pill-row>
```

```vue tab="Vue"
<PlinthPillRow label="Project sections" nav>
  <PlinthPill href="/overview" :selected="route.name === 'overview'">Overview</PlinthPill>
  <PlinthPill href="/tasks" :count="8" :selected="route.name === 'tasks'">Tasks</PlinthPill>
</PlinthPillRow>
```

```tsx tab="React"
import { PlinthPill, PlinthPillRow } from '@bdynamic/plinth/react';

<PlinthPillRow label="Status">
    {statuses.map((status) => (
        <PlinthPill
            key={status.value}
            count={status.count}
            selected={filter === status.value}
            onClick={() => setFilter(status.value)}
        >
            {status.label}
        </PlinthPill>
    ))}
</PlinthPillRow>;
```

## Accessibility

- A filter pill is a toggle button that always says whether it is on (`aria-pressed`).
- A navigation pill is a link, and the current one says so (`aria-current="page"`).
- The row is a named group, or a named `<nav>`, so it reads apart from the rest of the page.
- The selected pill has an accent edge as well as its tint, so colour is not its only cue.
- Every pill keeps a 40 × 40px touch target, and the focus ring stays inside the scrolling row.

The markup contract is at the top of
[`packages/css/src/components/pill-row.css`](../../packages/css/src/components/pill-row.css).
