---
'@bdynamic/plinth-css': patch
'@bdynamic/plinth-blade': patch
---

The icon button shows its pressed state in forced colours with the Highlight system colour, and its markup contract shows the link form and says a link never prints `aria-pressed`. In Blade, a blank `label` now falls back to the `aria-label` attribute, as in Vue and React, instead of refusing to render.
