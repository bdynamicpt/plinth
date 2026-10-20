---
'@bdynamic/plinth-css': minor
'@bdynamic/plinth-tokens': minor
'@bdynamic/plinth-vue': minor
'@bdynamic/plinth-react': minor
'@bdynamic/plinth-blade': minor
---

Add the dialog: a modal for a form, details or settings on a native `<dialog>`, centred at every width (`<x-plinth::dialog>`, `<PlinthDialog>`). `dismissible="false"` makes it an alert dialog with no close button that a tap on the backdrop leaves open, closing through its own buttons with Escape acting as Cancel; `side-phone="bottom"` makes it a bottom sheet below 768px. Its width is the new `--plinth-dialog-width` token. What the dialog and the sheet share (the surface, the backdrop, the scroll lock, the motion, the safe areas and the header, body and footer) moves into one base, `modal.css`, which a page that loads the components one by one loads with them; the sheet's markup and look don't change.
