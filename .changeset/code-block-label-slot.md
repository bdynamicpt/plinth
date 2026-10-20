---
'@bdynamic/plinth-vue': patch
---

Code block: a label slot the parent adds later (for example `<template v-if="file" #label>`) now shows. The Vue component checked the slot once, in a computed value that Vue never ran again, so the label stayed hidden; it now checks the slot as it renders, as Blade and React do.
