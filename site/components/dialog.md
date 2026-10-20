# Dialog

A modal for a task that sits on top of the page: a short form, the details of a record, a group of
settings. It is centred on the screen at every width, and can turn into a bottom sheet on a phone.

## When not to use it

- For filters, side information or navigation that belongs at the edge of the screen: use a
  [sheet](sheet.md).
- For a message the page can show in place: use a [callout](callout.md).
- For a long or many-step task: give it its own page.

## The parts

The dialogs on this page stay closed until you press their button.

```blade example
<x-plinth::button variant="secondary" commandfor="example-project" command="show-modal">Edit project</x-plinth::button>
<x-plinth::dialog id="example-project" title="Edit project" description="The name shows to everyone in the workspace.">
    <p>Rename the project, or move it to another workspace.</p>
    <x-slot:footer>
        <x-plinth::button variant="secondary" commandfor="example-project" command="close">Cancel</x-plinth::button>
        <x-plinth::button commandfor="example-project" command="close">Save</x-plinth::button>
    </x-slot:footer>
</x-plinth::dialog>
```

| Part                         | Element    | Required | What it is                                                             |
| ---------------------------- | ---------- | -------- | ---------------------------------------------------------------------- |
| `.plinth-dialog`             | `<dialog>` | yes      | The root. Needs an `id`; a project's classes and attributes land on it |
| `.plinth-dialog-panel`       | `<div>`    | yes      | The root's only child, holding the parts                               |
| `.plinth-dialog-handle`      | `<div>`    | no       | On a dismissible bottom sheet on a phone: the grab handle, decorative  |
| `.plinth-dialog-title`       | `<h2>`     | yes      | The dialog's accessible name                                           |
| `.plinth-dialog-description` | `<p>`      | no       | Its accessible description (`aria-describedby`)                        |
| `.plinth-dialog-close`       | `<button>` | no       | An icon button, named "Close" by default; only on a dismissible dialog |
| `.plinth-dialog-body`        | `<div>`    | yes      | The content; scrolls when it is taller than the screen                 |
| `.plinth-dialog-footer`      | `<div>`    | no       | Usually the actions: full width on a phone, at the end from 768px      |

Every layer generates an `id` when you leave it out, but pass your own when a button elsewhere
opens the dialog. Set the close button's name with **`close-label`** in the page's language.

## Dismissible or not

**`dismissible`** (default `true`) says whether the person may walk away. A dismissible dialog has
the close button and `closedby="any"`: the close button, Escape and a tap on the backdrop close
it.

Set `dismissible` to `false` for a choice the person has to make. The dialog becomes an alert
dialog (`role="alertdialog"`) with no close button and `closedby="closerequest"`, so a stray tap
on the backdrop leaves it open. It closes through its own buttons, and Escape acts as Cancel: the
browser fires `cancel` and then `close`, with an empty `returnValue`, as a Cancel button with
`command="close"` does. It needs an action that closes it, usually in the footer: a touch screen
has no Escape key. Put the least destructive action first, since the browser focuses the first
control when the dialog opens. Give it a description, which assistive technology reads as the
alert's message.

```blade example
<x-plinth::button variant="secondary" commandfor="example-leave" command="show-modal">Leave the page</x-plinth::button>
<x-plinth::dialog id="example-leave" title="Leave without saving?" description="Your changes to this project are lost if you leave now." :dismissible="false">
    <p>Save them first, or leave and start again later.</p>
    <x-slot:footer>
        <x-plinth::button variant="secondary" commandfor="example-leave" command="close">Stay</x-plinth::button>
        <x-plinth::button variant="danger" commandfor="example-leave" command="close">Leave</x-plinth::button>
    </x-slot:footer>
</x-plinth::dialog>
```

## On a phone

**`side-phone`** sets how the dialog shows below 768px. From 768px up every dialog is centred.

| Value              | Below 768px                                                                         |
| ------------------ | ----------------------------------------------------------------------------------- |
| `center` (default) | centred, the screen's width less a margin, up to `--plinth-dialog-width`            |
| `bottom`           | a bottom sheet: the screen's width, on the bottom edge, clearing the home indicator |

An unknown value falls back to `center`, which prints no attribute; `bottom` is
`data-side-phone="bottom"` on the root. CSS makes the switch, so it is the same in every layer.

A dismissible dialog at the bottom of a phone has a grab handle, and the person swipes it down to
close it, as the [drawer](drawer.md) explains: dragging is the browser's scrolling, and each layer
adds the few lines that close it when it is swiped off. Without the script the handle still shows and the close button and Escape close it, but a tap above the panel doesn't: on a phone the panel's root covers the backdrop. A dialog that isn't dismissible has no handle.

```blade example
<x-plinth::button variant="secondary" commandfor="example-bottom" command="show-modal">Edit project</x-plinth::button>
<x-plinth::dialog id="example-bottom" title="Edit project" side-phone="bottom">
    <p>On a phone this dialog slides up from the bottom edge.</p>
    <x-slot:footer>
        <x-plinth::button commandfor="example-bottom" command="close">Done</x-plinth::button>
    </x-slot:footer>
</x-plinth::dialog>
```

## Opening and closing

The dialog is a native modal dialog, so the browser does the work: it puts the dialog above
everything, dims the page behind it and makes it inert, keeps focus inside and returns focus to
the button that opened it. Open is the dialog's own `open` attribute, never a class.

- **Open it** with a button that has `commandfor="<id>" command="show-modal"`, with no script, or
  call `showModal()` on the dialog. Don't add `open` to the markup: that shows the dialog without
  making it modal.
- **Close it** with any button that has `command="close"` (a Cancel or Save in the footer), the
  close button or Escape. A `<form method="dialog">` inside closes it on submit too.
- **Tapping the backdrop** closes a dismissible dialog where the browser supports
  `closedby="any"`. Safari doesn't yet, which is why the close button is there.
- When it closes, the dialog fires **`close`**.

**In Livewire,** a re-render would morph the open dialog back to the server's markup and drop its
`open` attribute, closing it mid-task. Put `wire:ignore.self` on the dialog (or keep it outside
the component that re-renders), and always pass an `id`: a generated one changes on every render.
From Alpine, `x-ref="project"` on the dialog and `$refs.project.showModal()`.

In Vue, the component exposes **`showModal()`** and **`close()`**, and emits **`close`** (with the
dialog's native event) whenever the dialog closes. In React, the **`ref`** is the `<dialog>`
itself, with its own `showModal()` and `close()`, and **`onClose`** is the dialog's close event.

```blade tab="Blade"
<x-plinth::button variant="secondary" commandfor="project" command="show-modal">Edit project</x-plinth::button>

<x-plinth::dialog id="project" title="Edit project" wire:ignore.self>
    …
    <x-slot:footer>
        <x-plinth::button variant="secondary" commandfor="project" command="close">Cancel</x-plinth::button>
        <x-plinth::button wire:click="save">Save</x-plinth::button>
    </x-slot:footer>
</x-plinth::dialog>
```

```vue tab="Vue"
<PlinthButton variant="secondary" @click="project.showModal()">Edit project</PlinthButton>

<PlinthDialog ref="project" id="project" title="Edit project" @close="reset">
  …
  <template #footer>
    <PlinthButton variant="secondary" commandfor="project" command="close">Cancel</PlinthButton>
    <PlinthButton @click="save">Save</PlinthButton>
  </template>
</PlinthDialog>
```

```tsx tab="React"
import { useRef } from 'react';
import { PlinthButton, PlinthDialog } from '@bdynamic/plinth/react';

const project = useRef<HTMLDialogElement>(null);

<PlinthButton variant="secondary" onClick={() => project.current?.showModal()}>
    Edit project
</PlinthButton>;

<PlinthDialog
    ref={project}
    id="project"
    title="Edit project"
    onClose={reset}
    footer={<PlinthButton onClick={save}>Save</PlinthButton>}
>
    …
</PlinthDialog>;
```

## Scrolling and the keyboard

The body scrolls on its own, and scrolling past its end doesn't move the page; the header and the
footer stay put. While a dialog is open the page under it doesn't scroll at all, and
`scrollbar-gutter: stable` keeps the page from shifting when its scrollbar goes.

iOS lays the on-screen keyboard over the page instead of resizing it, so a field low in a dialog
can end up under the keyboard. For a dialog with a form, set `interactive-widget=resizes-content`
in the page's viewport meta, and keep the fields near the top, with the actions in the footer.

## Motion and depth

The dialog fades and rises a little into place, and as a bottom sheet it slides up, on
`--plinth-duration-normal`. Under `prefers-reduced-motion` the durations drop to 0ms, so it simply
appears. It floats above the page with `--plinth-elevation-3`, on `--plinth-color-surface-raised`
with a hairline edge, over a backdrop in `--plinth-color-overlay`.

The dialog and the [sheet](sheet.md) share one base, `modal.css`: the surface, the backdrop, the
scroll lock, the motion, the safe areas and the header, body and footer. `plinth.css` has it; a
page that loads the components one by one loads `modal.css` with `dialog.css`.

## Props

The same names in every layer. React takes the Vue props, with the body as `children` and the
footer as a prop that takes a node.

| Prop        | Blade                                               | Vue                    | React                  | Default   |
| ----------- | --------------------------------------------------- | ---------------------- | ---------------------- | --------- |
| id          | `id="project"`                                      | `id="project"`         | `id="project"`         | generated |
| title       | `title="Edit project"` (required)                   | `title="Edit project"` | `title="Edit project"` | none      |
| description | `description="…"`                                   | `description="…"`      | `description="…"`      | none      |
| closeLabel  | `close-label="Close"`                               | `close-label="Close"`  | `closeLabel="Close"`   | `Close`   |
| dismissible | `:dismissible="false"`                              | `:dismissible="false"` | `dismissible={false}`  | `true`    |
| sidePhone   | `side-phone="bottom"` (or a `DialogSidePhone` case) | `side-phone="bottom"`  | `sidePhone="bottom"`   | `center`  |
| body        | the slot                                            | the default slot       | `children`             | none      |
| footer      | `<x-slot:footer>`                                   | `#footer` slot         | `footer` (a node)      | none      |

Every layer needs a `title` and throws without one. Extra attributes reach the `<dialog>`, and a
project's own `closedby` or `role` replaces Plinth's; in React so do `onClose` and the `ref`.

## Accessibility

- A native modal dialog: focus is trapped inside, the page behind is inert, and focus returns to
  the button that opened it.
- The title names the dialog (`aria-labelledby`), and the description describes it
  (`aria-describedby`).
- A dismissible dialog has a close button, so it closes where a tap on the backdrop doesn't, and
  Escape closes it.
- A dialog that isn't dismissible is an `alertdialog` with no close button; Escape still closes
  it, as Cancel, so a keyboard user is never stuck.
- Motion drops to nothing under `prefers-reduced-motion`.
- Every control in it keeps a 40 × 40px touch target.

The markup contract is at the top of
[`packages/css/src/components/dialog.css`](../../packages/css/src/components/dialog.css).
