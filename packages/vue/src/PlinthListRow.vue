<script setup lang="ts">
// Markup contract: packages/css/src/components/list-row.css
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** A second line under the title. */
    description?: string;
    /** The row's own chevron, at the end, for a row that opens something. */
    chevron?: boolean;
    /** Renders the row as a link. */
    href?: string;
    /** Renders the row as a button, when it has no href. */
    button?: boolean;
    /** The row for the page being shown: aria-current="page". */
    current?: boolean;
    /** Disables a link or button row. */
    disabled?: boolean;
  }>(),
  {
    description: undefined,
    chevron: false,
    href: undefined,
    button: false,
    current: false,
    disabled: false,
  },
);

const tag = computed(() => (props.href ? 'a' : props.button ? 'button' : 'div'));
</script>

<template>
  <component
    :is="tag"
    class="plinth-list-row"
    :type="tag === 'button' ? 'button' : undefined"
    :href="tag === 'a' && !disabled ? href : undefined"
    :aria-current="current ? 'page' : undefined"
    :disabled="tag === 'button' && disabled ? true : undefined"
    :role="tag === 'a' && disabled ? 'link' : undefined"
    :aria-disabled="tag === 'a' && disabled ? 'true' : undefined"
  >
    <span v-if="$slots.leading" class="plinth-list-row-leading"><slot name="leading" /></span>
    <span class="plinth-list-row-content">
      <span class="plinth-list-row-title"><slot /></span>
      <span v-if="description" class="plinth-list-row-description">{{ description }}</span>
    </span>
    <span v-if="$slots.trailing || chevron" class="plinth-list-row-trailing"
      ><slot name="trailing" /><span
        v-if="chevron"
        class="plinth-icon plinth-list-row-chevron"
        data-size="sm"
        data-mirror
        aria-hidden="true"
        ><svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M9 6l6 6-6 6"></path></svg></span
    ></span>
  </component>
</template>
