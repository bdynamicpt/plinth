<script setup lang="ts">
// Markup contract: packages/css/src/components/section-menu.css
// A blank label counts as missing, as Blade's filled() decides.
withDefaults(
  defineProps<{
    /** The menu's accessible name (aria-label). */
    label?: string;
    /** A <nav> of links (the default); false for a <div role="group"> of buttons. */
    nav?: boolean;
  }>(),
  { label: undefined, nav: true },
);
</script>

<template>
  <component
    :is="nav ? 'nav' : 'div'"
    class="plinth-section-menu"
    :role="nav ? undefined : 'group'"
    :aria-label="label?.trim() ? label : undefined"
    ><slot
  /></component>
</template>
