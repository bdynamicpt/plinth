<script setup lang="ts">
// Markup contract: packages/css/src/components/badge.css
import { computed } from 'vue';
import { tone as toTone, type Tone } from './tones';

const props = withDefaults(
  defineProps<{
    tone?: Tone;
    dot?: boolean;
  }>(),
  { tone: 'neutral', dot: false },
);

const dataTone = computed(() => toTone(props.tone));
</script>

<template>
  <span class="plinth-badge" :data-tone="dataTone">
    <span v-if="dot" class="plinth-badge-dot" aria-hidden="true"></span>
    <span class="plinth-badge-label"><slot /></span>
  </span>
</template>
