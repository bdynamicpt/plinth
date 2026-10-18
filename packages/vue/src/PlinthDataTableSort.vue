<script setup lang="ts">
// Markup contract: packages/css/src/components/data-table.css
// The icon is dataTableSortIcon (data-table.ts), written out; parity keeps the copies equal.
</script>

<template>
  <button type="button" class="plinth-data-table-sort">
    <span class="plinth-data-table-sort-label"><slot /></span
    ><span class="plinth-icon plinth-data-table-sort-icon" data-size="sm" aria-hidden="true"
      ><svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path class="plinth-data-table-sort-up" d="M8 9l4-4 4 4"></path>
        <path class="plinth-data-table-sort-down" d="M8 15l4 4 4-4"></path></svg
    ></span>
  </button>
</template>
