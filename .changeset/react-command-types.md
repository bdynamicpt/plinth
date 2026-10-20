---
'@bdynamic/plinth-react': patch
---

`PlinthButton` and `PlinthIconButton` take `commandfor` and `command` as typed props, so a TypeScript project can open and close a sheet or dialog with an invoker command without spreading the attributes in. `@types/react` doesn't list them yet; Plinth types them on its own buttons and leaves React's global types alone. The values are exported as `InvokerCommand`. A link form takes neither.
