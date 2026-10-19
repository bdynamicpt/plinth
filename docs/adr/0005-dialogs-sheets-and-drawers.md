# 5. Dialogs, sheets and drawers: one base, named by what they are for

- Status: accepted
- Date: 2026-10-19
- Issue: [#60](https://github.com/bdynamicpt/plinth/issues/60) (with #61, #62 and #63)

## Context

Plinth has one modal component, the sheet (#23). It is a native `<dialog>` (ADR 2) whose look
depends on the screen and one attribute: a bottom sheet on a phone, and from 768px up either a
centred dialog (`placement="center"`) or a side panel (`placement="end"`). That is three patterns
in one component, and its name says which of them you get on none of the widths. Reviewing it,
the owner could not tell whether it was a dialog, a modal or a drawer.

The vocabulary most people and agents know is shadcn/ui's:

| shadcn       | What it is                                                                         |
| ------------ | ---------------------------------------------------------------------------------- |
| Dialog       | a centred modal                                                                    |
| Alert Dialog | a centred modal that must be answered                                              |
| Sheet        | a panel from the side the developer picks: `side="top \| right \| bottom \| left"` |
| Drawer       | a draggable bottom panel (Vaul)                                                    |

shadcn makes a dialog responsive in the app, by rendering a Dialog on desktop and a Drawer on a
phone behind a `useMediaQuery` hook. Plinth ships no script (ADR 2) and must behave the same in
Blade and Vue, so it does the switch in CSS instead.

## Decision

### 1. Three components and a confirmation dialog, on one base

| Component               | For                                                            | Phone (< 768px)                      | From 768px          |
| ----------------------- | -------------------------------------------------------------- | ------------------------------------ | ------------------- |
| **Dialog**              | forms, details, settings                                       | centred, or bottom with `side-phone` | centred             |
| **Confirmation dialog** | confirming an action, optionally with typed text or a password | as the dialog                        | centred             |
| **Sheet**               | filters, side information, navigation                          | its `side`, or `side-phone`          | its `side`          |
| **Drawer**              | phone-first panels the person drags                            | bottom, draggable, snap points       | a dialog or a sheet |

All of them are a native `<dialog>` opened with `showModal()` or `commandfor` /
`command="show-modal"`, with the browser's focus trap, Escape, top layer, inert page and focus
return (ADR 2). They share one base for the backdrop, the scroll lock, the motion, the safe areas
and the header, body and footer parts, so they cannot drift apart. Each has its own root class
(`plinth-dialog`, `plinth-sheet`, `plinth-drawer`) and its own presentation tokens.

### 2. Dialog

Centred at every width. `dismissible` (default `true`): when `false` the dialog has
`closedby="none"`, no close button and `role="alertdialog"`, so it closes only through its own
buttons and Escape acts as Cancel. This replaces a separate "alert dialog": whether a person may
walk away is a property, and the role follows from it. `side-phone="bottom"` makes it a bottom
sheet below 768px.

### 3. Confirmation dialog

A dialog that is always non-dismissible, for "are you sure?" moments, in three kinds: simple,
type to confirm ("type **harbour** to delete this project") and password. Its content is a
`<form method="dialog">`; type to confirm is `<input required pattern="…">`, so the browser blocks
the submit until the text matches, and the confirm button looks disabled through CSS alone. The
password is checked by the app, never by Plinth, which provides the field, the error message and
the busy state. `tone="danger"` gives the confirm button the danger variant.

### 4. Sheet: the developer picks the side

`side` is `end` (default), `start`, `top` or `bottom`, honoured at every width; sides are logical,
so `start` and `end` flip in right-to-left text. `side-phone` optionally sets the side below
768px: `side="end" side-phone="bottom"` is a side panel on desktop and a bottom sheet on a phone.
Both are data attributes the CSS reads; no script decides.

`placement` is removed, a breaking change: `placement="center"` is the dialog now, and
`placement="end"` becomes `side="end" side-phone="bottom"`. The menu sheet is a sheet with those
two attributes.

### 5. Drawer

A bottom panel with a drag handle, swipe-down to dismiss and optional snap points. Dragging is
native scrolling: the drawer is a scroll-snap container and the snap points are
`scroll-snap-align` positions, so the browser provides the momentum. Closing when it is swiped to
the closed position is the one thing the platform can't do; it is a few lines on `scrollend` in
each layer (an Alpine directive in Blade, a composable in Vue), as ADR 2, section 6 allows. Escape
and a visible close button keep it usable without touch. `desktop="dialog"` (default) or
`desktop="sheet"` sets its presentation from 768px up.

### 6. Not now

A separate Alert Dialog component (it is `dismissible="false"` on the dialog) and a top-anchored
drawer. Popovers and menus anchored to a trigger stay with the `popover` attribute (ADR 2).

## Consequences

- The sheet changes its API; projects using `placement` must switch, and the change ships as a
  major entry in the changelog.
- The docs pages need to show a component at every width, or the difference between these
  presentations stays invisible (#59).
- The drawer is the first component with layer code beyond forwarding; its contract documents
  what that code relies on.
- Build order: #59 (docs at every width), #60 dialog and the shared base, #61 sheet, #62
  confirmation dialog, #63 drawer.
