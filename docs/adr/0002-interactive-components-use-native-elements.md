# 2. Interactive components use native elements for their behaviour

- Status: accepted
- Date: 2026-10-18
- Issue: [#3](https://github.com/bdynamicpt/plinth/issues/3)

## Context

"Plain HTML and CSS" covers a badge, but not a sheet or a menu. Those open and close, trap focus,
close on Escape, and return focus to where it was. That behaviour has to live somewhere, and it
has to be the same in Blade and in Vue, or the parity tests stop meaning anything.

Plinth ships no JavaScript of its own today. The Blade layer runs in Filament panels, which already
load Alpine; the Vue layer has component state. Writing the behaviour twice, once per layer, is
what this decision avoids.

## Decision

**The platform first.** Behaviour comes from native elements and attributes, so it is part of the
markup contract and identical in every layer:

| Pattern               | Element                                    | What the browser does                                      |
| --------------------- | ------------------------------------------ | ---------------------------------------------------------- |
| Sheet, dialog         | `<dialog>`, opened with `showModal()`      | top layer, `::backdrop`, focus trap, Escape, focus returns |
| Menu, dropdown, popup | the `popover` attribute                    | top layer, light dismiss, Escape, focus returns            |
| Disclosure, accordion | `<details>` and `<summary>`                | open and close, keyboard, announced state                  |
| Opening and closing   | `command` and `commandfor` on a `<button>` | `show-modal`, `close`, `toggle-popover` without any script |

Invoker commands (`command` / `commandfor`) make opening a sheet declarative:

```html
<button type="button" commandfor="filters" command="show-modal">Filters</button>
<dialog id="filters" class="plinth-sheet" aria-labelledby="filters-title">
  <h2 id="filters-title">Filters</h2>
  <button type="button" commandfor="filters" command="close">Close</button>
</dialog>
```

**Browser support.** Plinth targets Baseline "newly available": features in the current releases
of Chrome, Edge, Firefox and Safari. `<dialog>`, `popover`, `<details>` and invoker commands all
are. Anything newer is a progressive enhancement that the component must work without:

- `closedby="any"` on a dialog (close by clicking the backdrop) is not in Safari yet. Sheets work
  without it: Escape and the close button always close them.
- CSS anchor positioning places popovers where it is supported; the core is Baseline, some of its
  newer properties are not. A popover without it falls back to a fixed position that still works
  (for example, under its trigger on a phone).
- Entry and exit animations (`@starting-style`, `transition-behavior: allow-discrete`) are
  enhancements, and use the motion tokens, which drop to 0ms under `prefers-reduced-motion`.

**State is the native state.** A sheet is open when the `<dialog>` has `open`; a popover is open
when it matches `:popover-open`; a disclosure when `<details>` has `open`. Component CSS styles
those (`.plinth-sheet[open]`, `.plinth-menu:popover-open`), and there is no `is-open` class to
keep in sync. `is-*` classes remain for state that has no native or ARIA form.

**Only what the platform can't do goes in a layer,** and then as little as possible: Alpine in the
Blade layer, component state in the Vue layer. The component's contract names the attributes and
events that code relies on (`open`, `close`, `toggle`, `beforetoggle`). A Vue component that needs
to open a sheet itself calls `showModal()` on a template ref and listens for `close`; it does not
render a different element or add classes. The parity test still compares the markup, with fixed
IDs in its cases.

**Menus of actions are lists of buttons in a popover,** navigated with Tab, not `role="menu"`.
The ARIA menu pattern needs arrow-key focus management, which is script in every layer; we add it
only for a component that truly needs it, and record why.

**Stories need no script.** Invoker commands and native elements work in the plain HTML, so a
story shows the real behaviour. If a future component does need script, its story adds it as a
Storybook decorator. That script is a demonstration, not part of the contract, and it does not
ship.

**IDs.** `commandfor`, `aria-labelledby` and friends need IDs. Blade and Vue components take an
`id` (and generate one when it is missing); stories and parity cases pass a fixed one.

## Consequences

- Sheets, menus and disclosures get focus handling, Escape, the top layer and focus return from
  the browser, the same in Blade and Vue, with no Plinth JavaScript to load.
- Plinth needs current browsers. Projects that must support older ones would need their own
  polyfills; we accept that.
- Closing a sheet by tapping the backdrop depends on `closedby`, so it will not work in Safari
  until Safari ships it. Every sheet therefore has a visible close button.
- When a browser feature is missing and a component can't work without it, the fix goes in the
  layer that needs it and the contract says so, rather than in a shared Plinth script.
