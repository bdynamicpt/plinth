---
'@bdynamic/plinth-tokens': minor
'@bdynamic/plinth-css': patch
---

A selected item is no longer shown by colour alone: the pressed icon button, the selected pill and the current section menu item take a 2px accent edge around the selection tint. A pressed button answers hover and press with the new `color.accent-subtle-hover` and `color.accent-subtle-active` tokens, in light and dark; a project that overrides `accent-subtle` overrides these two as well.
