<script setup lang="ts">
// Markup contract: packages/css/src/components/avatar.css
import { computed, warn, watchEffect } from 'vue';
import { avatarSize, initialsFrom, type AvatarSize } from './avatar';
import { tone as toTone, type Tone } from './tones';

const props = withDefaults(
  defineProps<{
    /** Whose avatar it is: the accessible name, and where initials come from. */
    name?: string;
    src?: string;
    initials?: string;
    size?: AvatarSize;
    status?: Tone;
    statusLabel?: string;
    /** Hidden from screen readers, for an avatar next to the name it shows. */
    decorative?: boolean;
  }>(),
  {
    name: '',
    src: undefined,
    initials: undefined,
    size: 'md',
    status: undefined,
    statusLabel: undefined,
    decorative: false,
  },
);

const dataSize = computed(() => avatarSize(props.size));
const tone = computed(() => (props.status ? toTone(props.status) : undefined));
const label = computed(() => {
  if (props.decorative) return undefined;
  return tone.value && props.statusLabel ? `${props.name}, ${props.statusLabel}` : props.name;
});
const letters = computed(() => props.initials ?? initialsFrom(props.name));

// The same mistakes Blade refuses: an avatar with no name, and a status only colour explains.
watchEffect(() => {
  if (props.decorative) return;
  if (!props.name.trim()) {
    warn('PlinthAvatar needs a name, or decorative when the name is shown next to it.');
  }
  if (props.status && !props.statusLabel) {
    warn(
      'PlinthAvatar needs a statusLabel with a status: colour alone does not say what it means.',
    );
  }
});
</script>

<template>
  <span
    class="plinth-avatar"
    :data-size="dataSize"
    :role="label === undefined ? undefined : 'img'"
    :aria-label="label"
    :aria-hidden="decorative ? 'true' : undefined"
  >
    <img v-if="src" class="plinth-avatar-image" :src="src" alt="" />
    <span v-else-if="letters" class="plinth-avatar-initials" aria-hidden="true">{{ letters }}</span>
    <svg
      v-else
      class="plinth-avatar-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
      stroke-linecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="9" r="4"></circle>
      <path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path>
    </svg>
    <span v-if="tone" class="plinth-avatar-status" :data-tone="tone" aria-hidden="true"></span>
  </span>
</template>
