<script setup lang="ts">
// Markup contract: packages/css/src/components/avatar.css
import { computed } from 'vue';
import { avatarGlyph, avatarSize, initialsFrom, type AvatarSize } from './avatar';
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
const tone = computed(() => (props.status === undefined ? undefined : toTone(props.status)));
const label = computed(() => {
  if (props.decorative) return undefined;
  return tone.value && props.statusLabel ? `${props.name}, ${props.statusLabel}` : props.name;
});
const letters = computed(() => props.initials ?? initialsFrom(props.name));
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
    <span v-else v-html="avatarGlyph" style="display: contents"></span>
    <span v-if="tone" class="plinth-avatar-status" :data-tone="tone" aria-hidden="true"></span>
  </span>
</template>
