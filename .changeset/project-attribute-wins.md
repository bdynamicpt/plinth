---
'@bdynamic/plinth-vue': patch
'@bdynamic/plinth-react': patch
---

`PlinthIcon` and `PlinthIconButton` now let a project's attribute win when it clashes with one they set, as Blade and the other components already do: `aria-hidden="false"` on an icon, or `aria-pressed="mixed"` on an icon button, is printed instead of being dropped. docs/adr/0002 records the rule for every layer.
