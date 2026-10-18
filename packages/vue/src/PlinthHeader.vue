<script setup lang="ts">
// Markup contract: packages/css/src/components/header.css
import { useSlots } from 'vue';
import { hasContent } from './slots';

const props = defineProps<{
  /** The page's title, an <h1>. */
  title: string;
}>();

defineSlots<{
  /** The leading action, usually a back link or a menu button. */
  leading?: () => unknown;
  /** The trailing actions, usually icon buttons. */
  actions?: () => unknown;
}>();

if (!props.title?.trim()) {
  throw new Error("<PlinthHeader> needs a title: it is the page's heading.");
}

const slots = useSlots();
</script>

<template>
  <header class="plinth-header">
    <div v-if="hasContent(slots.leading?.())" class="plinth-header-leading">
      <slot name="leading" />
    </div>
    <h1 class="plinth-header-title">{{ title }}</h1>
    <div v-if="hasContent(slots.actions?.())" class="plinth-header-actions">
      <slot name="actions" />
    </div>
  </header>
</template>
