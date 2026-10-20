---
'@bdynamic/plinth-tokens': minor
'@bdynamic/plinth-css': minor
'@bdynamic/plinth-vue': minor
'@bdynamic/plinth-react': minor
'@bdynamic/plinth-blade': minor
---

Add the drawer (`<x-plinth::drawer>`, `PlinthDrawer`): a panel on the bottom edge of a phone that
the person drags, with optional `peek`, `half` and `full` snap points, and a dialog or a sheet
from 768px up (`desktop`). Dragging is the browser's scroll snapping; each layer adds the few
lines that close it when it is swiped off (`x-init` in Blade, `useSwipeToClose` in Vue and React).

Every bottom panel on a phone now has a grab handle and closes when it is swiped down: a sheet
whose side on a phone is the bottom, the menu sheet and a dismissible dialog with
`side-phone="bottom"`. The dialog and the sheet print their parts in a new panel
(`plinth-dialog-panel`, `plinth-sheet-panel`), the root's only child, with the handle in it
(`plinth-dialog-handle`, `plinth-sheet-handle`). New token: `--plinth-drawer-peek-height`.

**Breaking:** the dialog's and the sheet's parts are inside the panel now, so a project's CSS that
selected them as the root's children (`.plinth-sheet > .plinth-sheet-body`) selects them inside the
panel (`.plinth-sheet .plinth-sheet-body`), and hand-written markup adds the panel. On a phone, a
tap above a bottom panel closes it through the layers' script, no longer through the browser's
`closedby="any"` alone.
