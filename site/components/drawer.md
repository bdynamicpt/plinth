# Drawer

A panel on the bottom edge of a phone that the person drags, like a maps app's panel: a route, the
details of a place on a map, a list to pick from while the page stays in view. It can rest at a
peek, half the screen and the full height, and dragged down past the lowest it closes. From 768px
up it is a dialog, or a sheet.

## When not to use it

- For a form, details or settings with no reason to drag: use the [dialog](dialog.md), with
  `side-phone="bottom"` for a bottom sheet on a phone. It has the grab handle and swipes down to
  close too.
- For filters, side information or navigation on an edge of the screen: use a [sheet](sheet.md).
- For a message the page can show in place: use a [callout](callout.md).

## The parts

The drawers on this page stay closed until you press their button. On a phone, drag one by its
handle or its header.

```blade example
<x-plinth::button variant="secondary" commandfor="example-route" command="show-modal">Show the route</x-plinth::button>
<x-plinth::drawer id="example-route" title="Route to the library" description="12 min by bike, 3.4 km.">
    <x-plinth::list-card heading="Steps" heading-level="h3">
        <li><x-plinth::list-row>Head north on Harbour Road<x-slot:trailing>400 m</x-slot:trailing></x-plinth::list-row></li>
        <li><x-plinth::list-row>Cross the old bridge<x-slot:trailing>300 m</x-slot:trailing></x-plinth::list-row></li>
        <li><x-plinth::list-row>Arrive at the library<x-slot:trailing>50 m</x-slot:trailing></x-plinth::list-row></li>
    </x-plinth::list-card>
    <x-slot:footer>
        <x-plinth::button variant="secondary">Share</x-plinth::button>
        <x-plinth::button commandfor="example-route" command="close">Start</x-plinth::button>
    </x-slot:footer>
</x-plinth::drawer>
```

| Part                         | Element    | Required | What it is                                                             |
| ---------------------------- | ---------- | -------- | ---------------------------------------------------------------------- |
| `.plinth-drawer`             | `<dialog>` | yes      | The root. Needs an `id`; a project's classes and attributes land on it |
| `.plinth-drawer-panel`       | `<div>`    | yes      | The root's only child, holding the parts; the surface on a phone       |
| `.plinth-drawer-handle`      | `<div>`    | yes      | The grab handle, decorative (`aria-hidden`); shown below 768px         |
| `.plinth-drawer-title`       | `<h2>`     | yes      | The drawer's accessible name                                           |
| `.plinth-drawer-description` | `<p>`      | no       | Its accessible description (`aria-describedby`)                        |
| `.plinth-drawer-close`       | `<button>` | yes      | An icon button, always there, named "Close" by default                 |
| `.plinth-drawer-body`        | `<div>`    | yes      | The content; scrolls inside the panel                                  |
| `.plinth-drawer-footer`      | `<div>`    | no       | Usually the actions: full width on a phone, at the end from 768px      |

Every layer generates an `id` when you leave it out, but pass your own when a button elsewhere
opens the drawer. Set the close button's name with **`close-label`** in the page's language.

## Dragging

On a phone the drawer slides up from the bottom edge. Dragging it is the browser's own scrolling:
the drawer is a scroll-snap container, so the drag follows the finger, keeps its momentum and
settles at the nearest resting place, and there is no drag code to load. Below the panel's
lowest resting place is a closed one; when the drawer settles there, it closes and fires `close`.

That last step is the one thing the platform can't do, so each layer adds a few lines on the
dialog's `scrollend`: an Alpine `x-init` in Blade (the page needs Alpine, which Livewire and
Filament load), and `useSwipeToClose` in Vue and React. They also close it on a tap above the
panel, which the browser counts as a tap on the dialog rather than its backdrop, and open it at
its snap point. Without the script the handle still shows, and the close button and Escape close
it.

## Snap points

**`snap-points`** lists where the drawer can rest on a phone: any of `peek`, `half` and `full`, as
a list or a string separated by spaces. With them the panel is the screen's height less a gap,
and only part of it shows at the lower points: `peek` shows `--plinth-drawer-peek-height` (the
handle, the header and the top of the body), `half` half the screen, `full` all of it. Without
them the drawer is as tall as its content, and it either shows or is dragged away.

**`snap`** is the one it opens at; it must be one of the listed ones, and it defaults to the
largest. The drawer remembers nothing: where it rests after that is the person's. Unknown values
are left out, in every layer, and the layers print the list smallest first, as
`data-snap-points` and `data-snap` on the root.

```blade example
<x-plinth::button variant="secondary" commandfor="example-place" command="show-modal">Show the place</x-plinth::button>
<x-plinth::drawer id="example-place" title="The old library" description="Open until 20:00." snap-points="peek half full" snap="peek">
    <x-plinth::list-card>
        <li><x-plinth::list-row description="Station Street 12">Address</x-plinth::list-row></li>
        <li><x-plinth::list-row description="Mon to Sat, 9:00 to 20:00">Hours</x-plinth::list-row></li>
        <li><x-plinth::list-row description="Free, with bike racks">Parking</x-plinth::list-row></li>
    </x-plinth::list-card>
</x-plinth::drawer>
```

The body scrolls inside the panel at every snap point, so a drawer with a long body is dragged by
its handle and its header; once the body is scrolled to its top, a swipe down on it moves the
drawer too.

## On a tablet or a desktop

From 768px up there is no handle and no dragging, and the snap points don't apply. **`desktop`**
picks what the drawer is there:

| Value              | The drawer                                                                     |
| ------------------ | ------------------------------------------------------------------------------ |
| `dialog` (default) | centred like the [dialog](dialog.md), `--plinth-dialog-width` wide             |
| `sheet`            | a full-height panel on the end edge like the [sheet](sheet.md), its side width |

An unknown value falls back to `dialog`. CSS makes the switch from `data-desktop` on the root, so
it is the same in every layer.

```blade example
<x-plinth::button variant="secondary" commandfor="example-stops" command="show-modal">Stops</x-plinth::button>
<x-plinth::drawer id="example-stops" title="Stops on the way" desktop="sheet" snap-points="half full">
    <x-plinth::list-card>
        <li><x-plinth::list-row button>Bakery</x-plinth::list-row></li>
        <li><x-plinth::list-row button>Bike shop</x-plinth::list-row></li>
        <li><x-plinth::list-row button>Viewpoint</x-plinth::list-row></li>
    </x-plinth::list-card>
</x-plinth::drawer>
```

## Opening and closing

The drawer is a native modal dialog, so the browser does the work: it puts the drawer above
everything, dims the page behind it and makes it inert, keeps focus inside, closes on Escape and
returns focus to the button that opened it. Open is the dialog's own `open` attribute, never a
class.

- **Open it** with a button that has `commandfor="<id>" command="show-modal"`, with no script, or
  call `showModal()` on the dialog. Don't add `open` to the markup.
- **Close it** with the close button, Escape, a swipe down, or any button with `command="close"`.
- **Tapping the backdrop** closes it: from 768px up where the browser supports `closedby="any"`
  (Safari doesn't yet), and on a phone through the layers' script. Set
  `closedby="closerequest"` on a drawer that must not close on a stray tap.
- When it closes, whichever way, the dialog fires **`close`**.

**In Livewire,** put `wire:ignore.self` on the drawer (or keep it outside the component that
re-renders), and always pass an `id`: a re-render would otherwise drop its `open` attribute. A
project's own `x-init` on the drawer replaces Plinth's, and the swipe with it.

In Vue, the component exposes **`showModal()`** and **`close()`**, and emits **`close`**. In
React, the **`ref`** is the `<dialog>` itself, and **`onClose`** is its close event.

```blade tab="Blade"
<x-plinth::button variant="secondary" commandfor="route" command="show-modal">Show the route</x-plinth::button>

<x-plinth::drawer id="route" title="Route" snap-points="peek half full" snap="peek" wire:ignore.self>
    …
</x-plinth::drawer>
```

```vue tab="Vue"
<PlinthButton variant="secondary" @click="route.showModal()">Show the route</PlinthButton>

<PlinthDrawer
    ref="route"
    id="route"
    title="Route"
    :snap-points="['peek', 'half', 'full']"
    snap="peek"
    @close="clearRoute"
>
  …
</PlinthDrawer>
```

```tsx tab="React"
import { useRef } from 'react';
import { PlinthButton, PlinthDrawer } from '@bdynamic/plinth/react';

const route = useRef<HTMLDialogElement>(null);

<PlinthButton variant="secondary" onClick={() => route.current?.showModal()}>
    Show the route
</PlinthButton>;

<PlinthDrawer
    ref={route}
    id="route"
    title="Route"
    snapPoints={['peek', 'half', 'full']}
    snap="peek"
    onClose={clearRoute}
>
    …
</PlinthDrawer>;
```

## Every bottom panel drags

The grab handle and the swipe down live in the base the drawer shares with the dialog and the
sheet, `modal.css`. So a [sheet](sheet.md) whose side on a phone is the bottom, the
[menu sheet](menu-sheet.md) and a dismissible [dialog](dialog.md) with `side-phone="bottom"` have
the handle on a phone and close when they are swiped down, the same way; the drawer adds the snap
points. A dialog that can't be dismissed, such as the [confirmation dialog](confirm-dialog.md),
has no handle.

## Motion and depth

The drawer slides up and back down on `--plinth-duration-normal`; from 768px up it moves as the
dialog or the sheet does. Under `prefers-reduced-motion` the durations drop to 0ms, so it simply
appears; the snapping is the browser's scrolling. It floats above the page with
`--plinth-elevation-3`, on `--plinth-color-surface-raised` with a hairline edge, over a backdrop in
`--plinth-color-overlay`. `plinth.css` has the base; a page that loads the components one by one
loads `modal.css` with `drawer.css`.

## Props

The same names in every layer. React takes the Vue props, with the body as `children` and the
footer as a prop that takes a node.

| Prop        | Blade                                                 | Vue                               | React                           | Default   |
| ----------- | ----------------------------------------------------- | --------------------------------- | ------------------------------- | --------- |
| id          | `id="route"`                                          | `id="route"`                      | `id="route"`                    | generated |
| title       | `title="Route"` (required)                            | `title="Route"`                   | `title="Route"`                 | none      |
| description | `description="…"`                                     | `description="…"`                 | `description="…"`               | none      |
| closeLabel  | `close-label="Close"`                                 | `close-label="Close"`             | `closeLabel="Close"`            | `Close`   |
| desktop     | `desktop="sheet"` (or a `DrawerDesktop` case)         | `desktop="sheet"`                 | `desktop="sheet"`               | `dialog`  |
| snapPoints  | `snap-points="peek full"` (or a list of `DrawerSnap`) | `:snap-points="['peek', 'full']"` | `snapPoints={['peek', 'full']}` | none      |
| snap        | `snap="peek"` (or a `DrawerSnap` case)                | `snap="peek"`                     | `snap="peek"`                   | largest   |
| body        | the slot                                              | the default slot                  | `children`                      | none      |
| footer      | `<x-slot:footer>`                                     | `#footer` slot                    | `footer` (a node)               | none      |

Every layer needs a `title` and throws without one. Extra attributes, such as `closedby`, reach the
`<dialog>`; in React so do `onClose` and the `ref`.

## Accessibility

- A native modal dialog: focus is trapped inside, the page behind is inert, Escape closes it and
  focus returns to the button that opened it.
- The title names the drawer (`aria-labelledby`), and the description describes it
  (`aria-describedby`).
- Dragging is never the only way: the close button is always there, and Escape closes it. The
  handle is decorative and hidden from assistive technology.
- The handle and the header are the drag area, well over 40px tall, and every control in the
  drawer keeps a 40 × 40px touch target.
- Motion drops to nothing under `prefers-reduced-motion`.

The markup contract is at the top of
[`packages/css/src/components/drawer.css`](../../packages/css/src/components/drawer.css).
