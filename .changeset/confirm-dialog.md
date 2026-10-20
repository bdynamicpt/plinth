---
'@bdynamic/plinth-css': minor
'@bdynamic/plinth-tokens': minor
'@bdynamic/plinth-vue': minor
'@bdynamic/plinth-react': minor
'@bdynamic/plinth-blade': minor
---

Add the confirmation dialog: a dialog that asks a person to confirm an action before it happens (`<x-plinth::confirm-dialog>`, `<PlinthConfirmDialog>`), always an alert dialog that closes only through Cancel, Escape or its confirm button. `kind` is `simple`, `type` (the person types `phrase` exactly; the browser blocks the confirm until it matches, and the confirm button looks disabled until then, with no script) or `password` (a password field the app checks, with `error` for a wrong one and `busy` while it checks). `tone="danger"` makes the confirm button the danger variant. Its content is a `<form method="dialog">`: the app listens for `submit` on the dialog. It needs `dialog.css` and `modal.css` with `confirm-dialog.css`. A new token, `--plinth-font-size-field` (16px), is the text size of a field on a phone, so iOS doesn't zoom in when it takes focus.
