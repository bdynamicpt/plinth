<script setup lang="ts">
// Markup contract: packages/css/src/components/icon.css
import { computed, useAttrs } from 'vue';
import { iconSize, type IconSize } from './icon';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    size?: IconSize;
    label?: string;
    mirror?: boolean;
  }>(),
  { size: 'md', label: undefined, mirror: false },
);

const attrs = useAttrs();
const dataSize = computed(() => iconSize(props.size));
// The label can also come as an aria-label attribute; a blank one leaves the icon decorative.
const name = computed(() => {
  const value = props.label ?? (attrs['aria-label'] as string | undefined);
  return value?.trim() ? value : undefined;
});
const rest = computed(() =>
  Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== 'aria-label')),
);
</script>

<template>
  <span
    class="plinth-icon"
    v-bind="rest"
    :data-size="dataSize"
    :data-mirror="mirror ? '' : undefined"
    :role="name ? 'img' : undefined"
    :aria-label="name"
    :aria-hidden="name ? undefined : 'true'"
    ><slot
  /></span>
</template>
