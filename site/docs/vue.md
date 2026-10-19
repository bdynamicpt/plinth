# Vue

The Vue 3 components print the same markup as the Blade and React ones, from the same CSS. They
hold no styles and no state the app should own.

```bash
npm install @bdynamic/plinth
```

## Set it up

Load the fonts and the CSS once, then import the components where you use them:

```ts label="src/main.ts"
import '@bdynamic/plinth/fonts.css';
import '@bdynamic/plinth/css';
```

```vue label="InvoiceStatus.vue"
<script setup lang="ts">
import { PlinthBadge } from '@bdynamic/plinth/vue';
</script>

<template>
    <PlinthBadge tone="success" dot>Paid</PlinthBadge>
</template>
```

Or register every component globally with the plugin:

```ts label="src/main.ts"
import { createApp } from 'vue';
import { Plinth } from '@bdynamic/plinth/vue';
import App from './App.vue';

createApp(App).use(Plinth).mount('#app');
```

## How the components behave

- **Attributes fall through to the root.** `class`, `id`, `data-*`, `aria-*` and listeners reach
  the component's documented root element, so a test id or an `aria-describedby` lands where you
  expect.
- **Events, not internal state.** A component emits documented events (a sheet's `close`, a code block's `copied`) and the
  app decides what happens. Layout state, such as the selected filter or the active nav item, is
  a prop the app sets.
- **Native behaviour.** A sheet is a `<dialog>`. To open one from code, call `showModal()` on a
  template ref, or use a button with `commandfor` and `command="show-modal"`, which needs no code
  at all.
- **Slots.** The default slot is the component's content; named slots (`icon`, `trailing`,
  `actions`) fill its parts.

```vue
<PlinthButton variant="secondary" @click="saveDraft">
  <template #icon><IconDocument /></template>
  Save draft
</PlinthButton>
```

## With Inertia

The components render the same on the server and in the browser, so they work with Inertia's
server-side rendering as they are.

## Your brand

Override the semantic tokens in a stylesheet loaded after Plinth's. See
[Branding your project](branding.md).
