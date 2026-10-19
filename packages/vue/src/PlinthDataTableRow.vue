<script setup lang="ts">
// Markup contract: packages/css/src/components/data-table.css
withDefaults(
  defineProps<{
    /** A selectable row's state, printed as aria-selected; leave it out when rows can't be selected. */
    selected?: boolean;
  }>(),
  { selected: undefined },
);
</script>

<template>
  <tr
    class="plinth-data-table-row"
    role="row"
    :aria-selected="selected === undefined ? undefined : selected ? 'true' : 'false'"
  >
    <slot />
  </tr>
</template>
