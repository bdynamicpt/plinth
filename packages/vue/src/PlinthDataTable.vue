<script setup lang="ts">
// Markup contract: packages/css/src/components/data-table.css
withDefaults(
  defineProps<{
    /** The table's name, shown above it. Without it, name the table with aria-label. */
    caption?: string;
  }>(),
  { caption: undefined },
);
</script>

<template>
  <table class="plinth-data-table" role="table">
    <caption v-if="caption?.trim()" class="plinth-data-table-caption">
      {{
        caption
      }}
    </caption>
    <thead class="plinth-data-table-head" role="rowgroup">
      <tr class="plinth-data-table-head-row" role="row">
        <slot name="head" />
      </tr>
    </thead>
    <tbody class="plinth-data-table-body" role="rowgroup">
      <slot />
    </tbody>
  </table>
</template>
