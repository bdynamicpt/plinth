<script setup lang="ts">
// Markup contract: packages/css/src/components/button.css (icon button)
import { computed, useAttrs } from 'vue';
import {
  buttonIconSize,
  buttonSize,
  buttonVariant,
  type ButtonSize,
  type ButtonVariant,
} from './button';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    /** The accessible name: required, since the button has no visible text. */
    label: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    href?: string;
    disabled?: boolean;
    busy?: boolean;
    /** Makes it a toggle: true or false prints aria-pressed. */
    pressed?: boolean | null;
    mirror?: boolean;
  }>(),
  {
    variant: 'ghost',
    size: 'md',
    href: undefined,
    disabled: false,
    busy: false,
    pressed: null,
    mirror: false,
  },
);

const attrs = useAttrs();
const dataVariant = computed(() => buttonVariant(props.variant));
const dataSize = computed(() => buttonSize(props.size));
const iconSize = computed(() => buttonIconSize(dataSize.value));
const isBusy = computed(() => props.busy && !props.disabled);
const name = computed(() => props.label || (attrs['aria-label'] as string | undefined));
const rest = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'aria-label')),
);
</script>

<template>
  <a
    v-if="href"
    class="plinth-button plinth-icon-button"
    v-bind="rest"
    :href="disabled ? undefined : href"
    :data-variant="dataVariant"
    :data-size="dataSize"
    :aria-label="name"
    :role="disabled ? 'link' : undefined"
    :aria-busy="isBusy ? 'true' : undefined"
    :aria-disabled="isBusy || disabled ? 'true' : undefined"
  >
    <span v-if="isBusy" class="plinth-button-spinner" aria-hidden="true"></span>
    <span
      v-else
      class="plinth-icon"
      :data-size="iconSize"
      :data-mirror="mirror ? '' : undefined"
      aria-hidden="true"
      ><slot
    /></span>
  </a>
  <button
    v-else
    type="button"
    class="plinth-button plinth-icon-button"
    v-bind="rest"
    :data-variant="dataVariant"
    :data-size="dataSize"
    :aria-label="name"
    :aria-pressed="pressed === null ? undefined : pressed ? 'true' : 'false'"
    :disabled="disabled || undefined"
    :aria-busy="isBusy ? 'true' : undefined"
    :aria-disabled="isBusy ? 'true' : undefined"
  >
    <span v-if="isBusy" class="plinth-button-spinner" aria-hidden="true"></span>
    <span
      v-else
      class="plinth-icon"
      :data-size="iconSize"
      :data-mirror="mirror ? '' : undefined"
      aria-hidden="true"
      ><slot
    /></span>
  </button>
</template>
