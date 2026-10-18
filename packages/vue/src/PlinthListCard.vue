<script setup lang="ts">
// Markup contract: packages/css/src/components/list-card.css
import { computed } from 'vue';
import { headingLevel as resolveLevel, type HeadingLevel } from './heading';

const props = withDefaults(
  defineProps<{
    /** A heading above the card. */
    heading?: string;
    /** The heading's element, h2 to h6. */
    headingLevel?: HeadingLevel;
    /** A note under the card. */
    footer?: string;
  }>(),
  { heading: undefined, headingLevel: 'h2', footer: undefined },
);

const level = computed(() => resolveLevel(props.headingLevel));
</script>

<template>
  <div class="plinth-list-card">
    <component :is="level" v-if="heading?.trim()" class="plinth-list-card-heading">{{
      heading
    }}</component>
    <ul class="plinth-list-card-list" role="list">
      <slot />
    </ul>
    <p v-if="footer?.trim()" class="plinth-list-card-footer">{{ footer }}</p>
  </div>
</template>
