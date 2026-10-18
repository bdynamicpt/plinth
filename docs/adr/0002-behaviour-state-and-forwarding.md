# 2. Behaviour through native elements, app-owned state, and forwarding attributes and events

- Status: accepted
- Date: 2026-10-18
- Issue: [#3](https://github.com/bdynamicpt/plinth/issues/3)

## Context

"Plain HTML and CSS" covers a badge, but not a sheet, a menu, the app shell or a split view. Those
open and close, trap focus, close on Escape, return focus to where it was, and need a way for the
app to say which pane is showing. That behaviour has to live somewhere, and it has to be the same
in Blade and in Vue, or the parity tests stop meaning anything.

Plinth ships no JavaScript of its own. The Blade layer runs in Laravel apps with Livewire and in
Filament panels, which already load Alpine; the Vue layer has component state. Writing the
behaviour twice, once per layer, is what this decision avoids. And because the components live
inside Livewire, Alpine and Vue apps, those apps must be able to reach them with their own
attributes and listeners.

## Decision

### 1. The platform first

Behaviour comes from native elements and attributes, so it is part of the markup contract and
identical in every layer:

| Pattern                        | Element                                   | What the browser does                                                                |
| ------------------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| Sheet (shell menu, user sheet) | `<dialog>`, opened with `showModal()`     | top layer, `::backdrop`, focus trap, the page behind is inert, Escape, focus returns |
| Menu, dropdown, popup          | the `popover` attribute                   | top layer, light dismiss, Escape, focus returns                                      |
| Disclosure, accordion          | `<details>` and `<summary>`               | open and close, keyboard, announced state                                            |
| Opening and closing            | `commandfor` / `command`, `popovertarget` | `show-modal`, `close`, `toggle-popover` without any script                           |

Invoker commands (`commandfor` / `command`) have been Baseline since December 2025, so opening a
sheet is declarative:

```html
<button type="button" commandfor="filters" command="show-modal">Filters</button>
<dialog id="filters" class="plinth-sheet" aria-labelledby="filters-title">
  <h2 id="filters-title">Filters</h2>
  <button type="button" commandfor="filters" command="close">Close</button>
</dialog>
```

**Menus of actions are lists of buttons in a popover,** navigated with Tab, not `role="menu"`.
The ARIA menu pattern needs arrow-key focus management, which is script in every layer; a
component adds it only if it truly needs it, and records why.

### 2. Browser support

Plinth targets Baseline "newly available": features in the current releases of Chrome, Edge,
Firefox and Safari. `<dialog>`, `popover`, `<details>`, `:has()`, `:modal` and invoker commands
all are. Anything newer is a progressive enhancement the component must work without:

- `closedby="any"` on a dialog (close by tapping the backdrop) is not in Safari yet. Escape and a
  visible close button always close a sheet.
- CSS anchor positioning places popovers where it works; the core is Baseline, some newer
  properties are not. Without it a popover falls back to a fixed position that still works.
- Entry and exit animations (`@starting-style`, `transition-behavior: allow-discrete`) use the
  motion tokens, which drop to 0ms under `prefers-reduced-motion`.

Projects that need older browsers bring their own polyfills.

### 3. Open and closed are the native state

A sheet is open when its `<dialog>` has `open`; a popover when it matches `:popover-open`; a
disclosure when its `<details>` has `open`. Component CSS styles those (`.plinth-sheet[open]`,
`.plinth-menu:popover-open`), and there is no `is-open` class to keep in sync. A sheet that must
start open is opened by the app (`showModal()` on load), not by a class.

### 4. The app owns the state

Plinth components never fetch, route or remember anything. Layout state (which split-view pane
shows on a phone, which nav item is active, whether a sheet starts open) is an attribute or an
`is-*` class that the app sets, from Livewire, Alpine, Vue or the server: for example
`aria-current="page"` on the active nav item, or `data-pane="detail"` on a split view. Plinth
defines what each state looks like, and the contract lists the states.

### 5. Framework layers forward attributes and events

So a component works inside Livewire, Alpine and Vue apps:

- **Blade** components merge `$attributes` onto the documented root element
  (`$attributes->merge(['class' => …])`), so `class`, `wire:*`, `x-*`, `href`, `data-*` and
  `aria-*` reach it, and classes are added rather than replaced.
- **Vue** components let attributes fall through to the same root, and emit documented events
  (`open`, `close`, `select`) instead of handling them internally.
- **The root is the element the app talks to.** When the useful target is an inner interactive
  element (the button in a row, the link in a nav item), that element becomes the root of its own
  component (`<x-plinth::nav-item>` renders the `<a>`), so forwarding always lands on the root.
  The contract names the root of every component.
- **Parity tests** render each component with extra attributes too (a class, an id, `data-*`,
  `aria-*`), and compare Blade and Vue with the story's markup, so forwarding cannot drift between
  the layers. Pest checks that `wire:*` and `x-*` attributes reach the root.

### 6. Only what the platform can't do goes in a layer

Then as little as possible: Alpine in the Blade layer, component state in the Vue layer. The
contract names the attributes and events that code relies on (`open`, `close`, `toggle`,
`beforetoggle`). A Vue component that opens a sheet itself calls `showModal()` on a template ref
and listens for `close`; it doesn't render a different element or add classes.

**Stories need no script.** Native elements and invoker commands work in the plain HTML, so a
story shows the real behaviour. If a future component needs script, its story adds it as a
Storybook decorator; that script is a demonstration, not part of the contract, and doesn't ship.

**IDs.** `commandfor` and `aria-labelledby` need IDs. Blade and Vue components take an `id` (and
generate one when it is missing); stories and parity cases pass a fixed one.

### 7. Scroll locking under an open sheet

A modal `<dialog>` makes the page behind it inert, but the page can still scroll. Plinth's CSS
locks it with no script:

```css
html:has(dialog:modal) {
  overflow: hidden;
}
```

With `scrollbar-gutter: stable` on `html`, so the page doesn't shift when the scrollbar goes,
and `overscroll-behavior: contain` on the sheet's scrolling area, so scrolling past its end
doesn't move the page. This ships with the sheet.

### 8. The bottom bar and the on-screen keyboard

The bottom bar is laid out in the normal flow, at the end of a shell that is `100dvh` tall, not
`position: fixed`. It keeps clear of the home indicator with `env(safe-area-inset-bottom)`.
Plinth's install docs ask projects to use
`<meta name="viewport" content="width=device-width, initial-scale=1, interactive-widget=resizes-content">`:

- Chrome and Firefox on Android then shrink the layout above the keyboard, and the bar stays usable
  above it.
- Safari on iOS doesn't support `interactive-widget` yet. The keyboard covers the bar while
  someone types, and the focused field scrolls into view. Because the bar isn't fixed, it never
  floats over the content in the middle of the screen. We accept the covered bar rather than ship
  a `visualViewport` script.

The bottom bar's own issue tests this on an iPhone and an Android phone. If the covered bar turns
out to be a real problem, a project can add a `visualViewport` script; Plinth still won't ship
one.

## Consequences

- Sheets, menus and disclosures get focus handling, Escape, the top layer and focus return from
  the browser, the same in Blade and Vue, with no Plinth JavaScript to load.
- Plinth needs current browsers.
- Tapping the backdrop to close a sheet waits for Safari to ship `closedby`, so every sheet has a
  visible close button.
- Components stay stateless and reusable across projects; each app decides where its state lives.
- Livewire, Alpine and Vue apps reach every component through its root, and a parity case per
  component keeps Blade and Vue forwarding the same attributes.
- On iOS the keyboard covers the bottom bar while someone types.
