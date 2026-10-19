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

// A whole number of at least 1; anything that isn't a decimal number is 1, as Blade's view decides.
const decimal = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/;
const span = computed(() => {
  const value = typeof props.columns === 'number' ? props.columns : String(props.columns);
  const count = typeof value === 'number' || decimal.test(value) ? Number(value) : Number.NaN;
  return Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
});
</script>

<template>
  <tr class="plinth-data-table-empty" role="row">
    <td class="plinth-data-table-empty-cell" role="cell" :colspan="span">
      <slot />
    </td>
  </tr>
</template>
