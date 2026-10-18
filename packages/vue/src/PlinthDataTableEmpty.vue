<script setup lang="ts">
// Markup contract: packages/css/src/components/data-table.css
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** How many columns the table has; the empty cell spans them all. */
    columns?: number | string;
  }>(),
  { columns: 1 },
);

// Whole numbers of at least 1, as Blade's view decides.
const span = computed(() => Math.max(1, Math.trunc(Number(props.columns)) || 1));
</script>

<template>
  <tr class="plinth-data-table-empty" role="row">
    <td class="plinth-data-table-empty-cell" role="cell" :colspan="span">
      <slot />
    </td>
  </tr>
</template>
