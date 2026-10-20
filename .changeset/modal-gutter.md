---
'@bdynamic/plinth-css': patch
'@bdynamic/plinth-blade': patch
---

An open dialog, sheet or drawer and its backdrop reach the edge of the screen where the scrollbar takes space. The browser never draws the top layer in the scrollbar gutter, so the modal base no longer keeps a stable gutter on the page and turns the gutter off while a modal is open; the page under the backdrop shifts by the scrollbar's width instead.
