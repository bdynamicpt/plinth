<script setup lang="ts">
// Markup contract: packages/css/src/components/callout.css
import { computed, useSlots } from 'vue';
import {
  calloutIcons,
  calloutRole,
  calloutTone,
  type CalloutRole,
  type CalloutTone,
} from './callout';
import { hasContent } from './slots';

const props = withDefaults(
  defineProps<{
    tone?: CalloutTone;
    /** `note` for a note in the page; `status` or `alert` for a message the app adds. */
    role?: CalloutRole;
    /** A short title above the text (the title slot takes markup). */
    title?: string;
  }>(),
  { tone: 'neutral', role: 'note', title: undefined },
);

const slots = useSlots();
const dataTone = computed(() => calloutTone(props.tone));
const dataRole = computed(() => calloutRole(props.role));
const hasTitle = computed(() => Boolean(props.title?.trim()) || hasContent(slots.title?.()));
const hasText = computed(() => hasContent(slots.default?.()));
const hasActions = computed(() => hasContent(slots.actions?.()));
const hasIcon = computed(() => hasContent(slots.icon?.()));
</script>

<template>
  <div class="plinth-callout" :data-tone="dataTone" :role="dataRole">
    <span v-if="hasIcon" class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true"
      ><slot name="icon"
    /></span>
    <span
      v-else
      class="plinth-icon plinth-callout-icon"
      data-size="md"
      aria-hidden="true"
      v-html="calloutIcons[dataTone]"
    ></span>
    <div class="plinth-callout-body">
      <p v-if="hasTitle" class="plinth-callout-title">
        <slot name="title">{{ title }}</slot>
      </p>
      <div v-if="hasText" class="plinth-callout-text"><slot /></div>
      <div v-if="hasActions" class="plinth-callout-actions"><slot name="actions" /></div>
    </div>
  </div>
</template>
