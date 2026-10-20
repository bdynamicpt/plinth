<script setup lang="ts">
// Markup contract: packages/css/src/components/drawer.css
import { computed, ref, useId, useSlots } from 'vue';
import PlinthIconButton from './PlinthIconButton.vue';
import {
  drawerDesktop,
  drawerSnap,
  drawerSnapPoints,
  type DrawerDesktop,
  type DrawerSnap,
} from './drawer';
import { hasContent } from './slots';
import { useSwipeToClose } from './swipe';

const props = withDefaults(
  defineProps<{
    /** The dialog's id; one is generated when it is missing. */
    id?: string;
    /** The heading, and the drawer's accessible name. */
    title: string;
    /** A line under the title, and the drawer's accessible description. */
    description?: string;
    /** The close button's accessible name. */
    closeLabel?: string;
    /** Its presentation from 768px up: a dialog or a sheet. */
    desktop?: DrawerDesktop;
    /** Where it can rest on a phone (a list, or a string separated by spaces); none for as tall as its content. */
    snapPoints?: readonly DrawerSnap[] | string;
    /** The snap point it opens at; the largest listed when it is missing. */
    snap?: DrawerSnap;
  }>(),
  {
    id: undefined,
    description: undefined,
    closeLabel: 'Close',
    desktop: 'dialog',
    snapPoints: undefined,
    snap: undefined,
  },
);

const emit = defineEmits<{
  /** The dialog closed: the close button, Escape, the backdrop, a swipe down or close(). */
  close: [event: Event];
}>();

if (!props.title?.trim()) {
  throw new Error("<PlinthDrawer> needs a title: it is the drawer's accessible name.");
}

const slots = useSlots();
const generatedId = useId();
const drawerId = computed(() => props.id?.trim() || `plinth-drawer-${generatedId}`);
const points = computed(() => drawerSnapPoints(props.snapPoints));
const hasDescription = computed(() => Boolean(props.description?.trim()));

const dialog = ref<HTMLDialogElement>();
// Dragged down to close, and opened at its snap point (modal.css).
useSwipeToClose(dialog);

defineExpose({
  /** Opens the drawer as a modal dialog. */
  showModal: () => dialog.value?.showModal(),
  /** Closes the drawer; the dialog fires `close`. */
  close: () => dialog.value?.close(),
});
</script>

<template>
  <dialog
    :id="drawerId"
    ref="dialog"
    class="plinth-drawer"
    :data-desktop="drawerDesktop(desktop)"
    :data-snap-points="points.length ? points.join(' ') : undefined"
    :data-snap="drawerSnap(snap, points)"
    closedby="any"
    :aria-labelledby="`${drawerId}-title`"
    :aria-describedby="hasDescription ? `${drawerId}-description` : undefined"
    @close="emit('close', $event)"
  >
    <div class="plinth-drawer-panel">
      <div class="plinth-drawer-handle" aria-hidden="true"></div>
      <div class="plinth-drawer-header">
        <h2 :id="`${drawerId}-title`" class="plinth-drawer-title">{{ title }}</h2>
        <p v-if="hasDescription" :id="`${drawerId}-description`" class="plinth-drawer-description">
          {{ description }}
        </p>
        <PlinthIconButton
          class="plinth-drawer-close"
          :label="closeLabel"
          variant="ghost"
          :commandfor="drawerId"
          command="close"
          ><svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M6 6l12 12M18 6L6 18"></path></svg
        ></PlinthIconButton>
      </div>
      <div class="plinth-drawer-body"><slot /></div>
      <div v-if="hasContent(slots.footer?.())" class="plinth-drawer-footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>
