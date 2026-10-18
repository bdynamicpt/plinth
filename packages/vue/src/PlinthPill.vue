<script setup lang="ts">
// Markup contract: packages/css/src/components/pill-row.css
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** A number after the label, such as how many items the filter shows. */
    count?: string | number;
    /** Renders the pill as a link, for a row that navigates. */
    href?: string;
    /** The selected pill: aria-pressed="true" on a button, aria-current="page" on a link. */
    selected?: boolean;
    /** Disables the pill. */
    disabled?: boolean;
  }>(),
  { count: undefined, href: undefined, selected: false, disabled: false },
);

const tag = computed(() => (props.href ? 'a' : 'button'));
const hasCount = computed(() => props.count !== undefined && props.count !== '');
</script>

<template>
  <component
    :is="tag"
    class="plinth-pill"
    :type="tag === 'button' ? 'button' : undefined"
    :href="tag === 'a' && !disabled ? href : undefined"
    :aria-pressed="tag === 'button' ? String(selected) : undefined"
    :aria-current="tag === 'a' && selected ? 'page' : undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    :role="tag === 'a' && disabled ? 'link' : undefined"
    :aria-disabled="tag === 'a' && disabled ? 'true' : undefined"
  >
    <span class="plinth-pill-label"><slot /></span>
    <span v-if="hasCount" class="plinth-pill-count">{{ count }}</span>
  </component>
</template>
