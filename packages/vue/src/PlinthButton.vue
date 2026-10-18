<script setup lang="ts">
// Markup contract: packages/css/src/components/button.css
import { computed } from 'vue';
import { buttonVariant, type ButtonVariant } from './button';
import { controlSizes, iconSizeFor, resolveSize, type ControlSize } from './size';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant;
    size?: ControlSize;
    href?: string;
    disabled?: boolean;
    busy?: boolean;
    mirrorIcon?: boolean;
    mirrorTrailing?: boolean;
  }>(),
  {
    variant: 'primary',
    size: 'md',
    href: undefined,
    disabled: false,
    busy: false,
    mirrorIcon: false,
    mirrorTrailing: false,
  },
);

const dataVariant = computed(() => buttonVariant(props.variant));
const dataSize = computed(() => resolveSize(props.size, controlSizes, 'md'));
const iconSize = computed(() => iconSizeFor(dataSize.value));
const isBusy = computed(() => props.busy && !props.disabled);
</script>

<template>
  <a
    v-if="href"
    class="plinth-button"
    :href="disabled ? undefined : href"
    :data-variant="dataVariant"
    :data-size="dataSize"
    :role="disabled ? 'link' : undefined"
    :aria-busy="isBusy ? 'true' : undefined"
    :aria-disabled="isBusy || disabled ? 'true' : undefined"
  >
    <span v-if="isBusy" class="plinth-button-spinner" aria-hidden="true"></span>
    <span
      v-else-if="$slots.icon"
      class="plinth-icon"
      :data-size="iconSize"
      :data-mirror="mirrorIcon ? '' : undefined"
      aria-hidden="true"
      ><slot name="icon"
    /></span>
    <span class="plinth-button-label"><slot /></span>
    <span
      v-if="$slots.trailing"
      class="plinth-icon"
      :data-size="iconSize"
      :data-mirror="mirrorTrailing ? '' : undefined"
      aria-hidden="true"
      ><slot name="trailing"
    /></span>
  </a>
  <button
    v-else
    type="button"
    class="plinth-button"
    :data-variant="dataVariant"
    :data-size="dataSize"
    :disabled="disabled || undefined"
    :aria-busy="isBusy ? 'true' : undefined"
    :aria-disabled="isBusy ? 'true' : undefined"
  >
    <span v-if="isBusy" class="plinth-button-spinner" aria-hidden="true"></span>
    <span
      v-else-if="$slots.icon"
      class="plinth-icon"
      :data-size="iconSize"
      :data-mirror="mirrorIcon ? '' : undefined"
      aria-hidden="true"
      ><slot name="icon"
    /></span>
    <span class="plinth-button-label"><slot /></span>
    <span
      v-if="$slots.trailing"
      class="plinth-icon"
      :data-size="iconSize"
      :data-mirror="mirrorTrailing ? '' : undefined"
      aria-hidden="true"
      ><slot name="trailing"
    /></span>
  </button>
</template>
