<script setup lang="ts">
// Markup contract: packages/css/src/components/pill-row.css
withDefaults(
  defineProps<{
    /** The row's accessible name (aria-label). */
    label?: string;
    /** Renders the row as a <nav>, for pills that are links. */
    nav?: boolean;
  }>(),
  { label: undefined, nav: false },
);
</script>

<template>
  <component
    :is="nav ? 'nav' : 'div'"
    class="plinth-pill-row"
    :role="nav ? undefined : 'group'"
    :aria-label="label || undefined"
    ><slot
  /></component>
</template>
