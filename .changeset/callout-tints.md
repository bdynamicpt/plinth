---
'@bdynamic/plinth-tokens': minor
'@bdynamic/plinth-css': minor
---

Give the callout its own component tokens, `--plinth-callout-<tone>-surface` and `-border` for neutral, info, success, warning and danger, in light and dark. The tones are now a faint, translucent tint with a tinted hairline border, quieter than the status surfaces, which badges keep. Component tokens can now change with the theme (`component.light.json` and `component.dark.json`), and a token's value may hold references inside it, such as a `color-mix()`, which the CSS writes as `var()`s.
