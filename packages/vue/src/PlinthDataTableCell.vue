<script setup lang="ts">
// Markup contract: packages/css/src/components/data-table.css
import { computed } from 'vue';
import { dataTableCellKind, type DataTableCellKind } from './data-table';

const props = withDefaults(
  defineProps<{
    /** The column's name, shown before the value on a phone's card. */
    label?: string;
    /** What the cell is on a phone's card: a labelled field, the card's title, or its actions. */
    kind?: DataTableCellKind;
    /** Numbers: aligned to the end, with figures of one width. */
    numeric?: boolean;
    /** Hidden on a phone's card; shown from 768px up. */
    hideOnPhone?: boolean;
  }>(),
  { label: undefined, kind: 'field', numeric: false, hideOnPhone: false },
);

const resolvedKind = computed(() => dataTableCellKind(props.kind));
</script>

<template>
  <td
    class="plinth-data-table-cell"
    role="cell"
    :data-kind="resolvedKind"
    :data-numeric="numeric ? '' : undefined"
    :data-phone="hideOnPhone ? 'hidden' : undefined"
  >
    <span v-if="label?.trim()" class="plinth-data-table-label" aria-hidden="true">{{ label }}</span>
    <span class="plinth-data-table-value"><slot /></span>
  </td>
</template>
