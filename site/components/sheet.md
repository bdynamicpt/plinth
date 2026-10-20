# Sheet

A modal panel for a task that sits on top of the page: filters, a short form, a confirmation, a
list of options. On a phone it slides up from the bottom; from 768px up it shows as a dialog in the
middle of the screen, or as a full-height panel on the side.

## When not to use it

- For a form, details or settings centred on the screen at every width: use the
  [dialog](dialog.md), which shares the sheet's base.
- For a message the page can show in place: use a [callout](callout.md).
- For the app's menu: use the [menu sheet](menu-sheet.md), which is a sheet already.
- For a long or many-step task: give it its own page.

## The parts

The sheets on this page stay closed until you press their button.

```blade example
<x-plinth::button variant="secondary" commandfor="example-filters" command="show-modal">Filters</x-plinth::button>
<x-plinth::sheet id="example-filters" title="Filters" description="Only the invoices that match are shown.">
    <x-plinth::pill-row label="Status">
        <x-plinth::pill selected>Due</x-plinth::pill>
        <x-plinth::pill>Paid</x-plinth::pill>
        <x-plinth::pill>Drafts</x-plinth::pill>
    </x-plinth::pill-row>
    <x-slot:footer>
        <x-plinth::button variant="secondary" commandfor="example-filters" command="close">Reset</x-plinth::button>
        <x-plinth::button commandfor="example-filters" command="close">Apply</x-plinth::button>
    </x-slot:footer>
</x-plinth::sheet>
```

| Part                        | Element    | Required | What it is                                                             |
| --------------------------- | ---------- | -------- | ---------------------------------------------------------------------- |
| `.plinth-sheet`             | `<dialog>` | yes      | The root. Needs an `id`; a project's classes and attributes land on it |
| `.plinth-sheet-title`       | `<h2>`     | yes      | The sheet's accessible name                                            |
| `.plinth-sheet-description` | `<p>`      | no       | Its accessible description (`aria-describedby`)                        |
| `.plinth-sheet-close`       | `<button>` | yes      | An icon button, always there, named "Close" by default                 |
| `.plinth-sheet-body`        | `<div>`    | yes      | The content; scrolls when it is taller than the screen                 |
| `.plinth-sheet-footer`      | `<div>`    | no       | Usually the actions: full width on a phone, at the end from 768px      |

Every layer generates an `id` when you leave it out, but pass your own when a button elsewhere
opens the sheet. Set the close button's name with **`close-label`** in the page's language.

## Placement

**`placement`** sets how the sheet shows from 768px up. On a phone every sheet is a bottom sheet.

| Value              | From 768px up                                                         |
| ------------------ | --------------------------------------------------------------------- |
| `center` (default) | a dialog in the middle of the screen, `--plinth-sheet-width` wide     |
| `end`              | a full-height panel on the end edge, `--plinth-sheet-side-width` wide |

An unknown value falls back to `center`. The end edge is the right in left-to-right text and the
left in right-to-left text.

```blade example
<x-plinth::button variant="secondary" commandfor="example-member" command="show-modal">Ana Lima</x-plinth::button>
<x-plinth::sheet id="example-member" title="Ana Lima" placement="end">
    <x-plinth::list-card>
        <li><x-plinth::list-row description="ana@example.com">Email</x-plinth::list-row></li>
        <li><x-plinth::list-row description="Editor">Role</x-plinth::list-row></li>
    </x-plinth::list-card>
</x-plinth::sheet>
```

## Opening and closing

The sheet is a native modal dialog, so the browser does the work: it puts the sheet above
everything, dims the page behind it and makes it inert, keeps focus inside, closes on Escape and
returns focus to the button that opened it. Open is the dialog's own `open` attribute, never a
class.

- **Open it** with a button that has `commandfor="<id>" command="show-modal"`, with no script, or
  call `showModal()` on the dialog. Don't add `open` to the markup: that shows the dialog without
  making it modal.
- **Close it** with the close button, Escape, or any button with `command="close"` (an Apply or
  Cancel in the footer). A `<form method="dialog">` inside closes it on submit too.
- **Tapping the backdrop** closes it where the browser supports `closedby="any"`. Safari doesn't
  yet, which is why the close button is always there. Set `closedby="closerequest"` on a sheet that
  must not close on a stray tap, such as a form with unsaved changes.
- When it closes, the dialog fires **`close`**.

**In Livewire,** a re-render would morph the open dialog back to the server's markup and drop its
`open` attribute, closing it mid-task. Put `wire:ignore.self` on the sheet (or keep it outside the
component that re-renders), and always pass an `id`: a generated one changes on every render. From
Alpine, `x-ref="filters"` on the sheet and `$refs.filters.showModal()`.

In Vue, the component exposes **`showModal()`** and **`close()`**, and emits **`close`** (with the
dialog's native event) whenever the dialog closes. In React, the **`ref`** is the `<dialog>`
itself, with its own `showModal()` and `close()`, and **`onClose`** is the dialog's close event.
React's types don't list `command` and `commandfor` yet
([#99](https://github.com/bdynamicpt/plinth/issues/99)); they work as they are, but TypeScript
wants them spread in (`{...{ commandfor: 'filters', command: 'show-modal' }}`), or use the ref.

```blade tab="Blade"
<x-plinth::button variant="secondary" commandfor="filters" command="show-modal">Filters</x-plinth::button>

<x-plinth::sheet id="filters" title="Filters" wire:ignore.self>
    …
    <x-slot:footer>
        <x-plinth::button variant="secondary" wire:click="resetFilters">Reset</x-plinth::button>
        <x-plinth::button commandfor="filters" command="close">Apply</x-plinth::button>
    </x-slot:footer>
</x-plinth::sheet>
```

```vue tab="Vue"
<PlinthButton variant="secondary" @click="filters.showModal()">Filters</PlinthButton>

<PlinthSheet ref="filters" id="filters" title="Filters" @close="applyFilters">
  …
  <template #footer>
    <PlinthButton commandfor="filters" command="close">Apply</PlinthButton>
  </template>
</PlinthSheet>
```

```tsx tab="React"
import { useRef } from 'react';
import { PlinthButton, PlinthSheet } from '@bdynamic/plinth/react';

const filters = useRef<HTMLDialogElement>(null);

<PlinthButton variant="secondary" onClick={() => filters.current?.showModal()}>
    Filters
</PlinthButton>;

<PlinthSheet
    ref={filters}
    id="filters"
    title="Filters"
    onClose={applyFilters}
    footer={<PlinthButton onClick={() => filters.current?.close()}>Apply</PlinthButton>}
>
    …
</PlinthSheet>;
```

## Scrolling and the keyboard

The body scrolls on its own, and scrolling past its end doesn't move the page. While a sheet is
open the page under it doesn't scroll at all, and `scrollbar-gutter: stable` keeps the page from
shifting when its scrollbar goes. On a phone the sheet leaves a gap at the top, so it reads as a
sheet over the page, and its last part clears the home indicator.

iOS lays the on-screen keyboard over the page instead of resizing it, so a field low in a sheet can
end up under the keyboard. For a sheet with a form, set `interactive-widget=resizes-content` in the
page's viewport meta, and keep the fields near the top of the sheet, with its actions in the footer.

## Motion and depth

The sheet slides up on a phone, fades and rises a little as a dialog, and slides in from the side
as a panel, on `--plinth-duration-normal`. Under `prefers-reduced-motion` the durations drop to
0ms, so it simply appears. A sheet floats above the page, so it is one of the few places with a
shadow: `--plinth-elevation-3`, on `--plinth-color-surface-raised` with a hairline edge, over a
backdrop in `--plinth-color-overlay`.

## Props

The same names in every layer. React takes the Vue props, with the body as `children` and the
footer as a prop that takes a node.

| Prop        | Blade                                          | Vue                   | React                | Default   |
| ----------- | ---------------------------------------------- | --------------------- | -------------------- | --------- |
| id          | `id="filters"`                                 | `id="filters"`        | `id="filters"`       | generated |
| title       | `title="Filters"` (required)                   | `title="Filters"`     | `title="Filters"`    | none      |
| description | `description="…"`                              | `description="…"`     | `description="…"`    | none      |
| closeLabel  | `close-label="Close"`                          | `close-label="Close"` | `closeLabel="Close"` | `Close`   |
| placement   | `placement="end"` (or a `SheetPlacement` case) | `placement="end"`     | `placement="end"`    | `center`  |
| body        | the slot                                       | the default slot      | `children`           | none      |
| footer      | `<x-slot:footer>`                              | `#footer` slot        | `footer` (a node)    | none      |

Every layer needs a `title` and throws without one. Extra attributes, such as `closedby`, reach the
`<dialog>`; in React so do `onClose` and the `ref`.

## Accessibility

- A native modal dialog: focus is trapped inside, the page behind is inert, Escape closes it and
  focus returns to the button that opened it.
- The title names the sheet (`aria-labelledby`), and the description describes it
  (`aria-describedby`).
- The close button is always there, so the sheet closes where a tap on the backdrop doesn't.
- Motion drops to nothing under `prefers-reduced-motion`.
- Every control in it keeps a 40 × 40px touch target.

The markup contract is at the top of
[`packages/css/src/components/sheet.css`](../../packages/css/src/components/sheet.css).
