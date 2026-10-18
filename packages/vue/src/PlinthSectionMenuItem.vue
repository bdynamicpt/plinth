<script setup lang="ts">
// Markup contract: packages/css/src/components/section-menu.css
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** A number after the label, such as how many items the section holds. */
    count?: string | number | null;
    /** The section's address; without it the item is a button that switches the view in place. */
    href?: string;
    /** The current section: aria-current="page" on a link, aria-pressed="true" on a button. */
    current?: boolean;
    /** Disables the item. */
    disabled?: boolean;
  }>(),
  { count: undefined, href: undefined, current: false, disabled: false },
);

const tag = computed(() => (props.href ? 'a' : 'button'));
// Missing or blank prints no count, as Blade's filled() decides.
const hasCount = computed(() => props.count != null && String(props.count).trim() !== '');
</script>

<template>
  <component
    :is="tag"
    class="plinth-section-menu-item"
    :type="tag === 'button' ? 'button' : undefined"
    :href="tag === 'a' && !disabled ? href : undefined"
    :aria-pressed="tag === 'button' ? String(current) : undefined"
    :aria-current="tag === 'a' && current ? 'page' : undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    :role="tag === 'a' && disabled ? 'link' : undefined"
    :aria-disabled="tag === 'a' && disabled ? 'true' : undefined"
  >
    <span class="plinth-section-menu-label"><slot /></span>
    <span v-if="hasCount" class="plinth-section-menu-count">{{ count }}</span>
  </component>
</template>
