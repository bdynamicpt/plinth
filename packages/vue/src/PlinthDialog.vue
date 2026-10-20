<script setup lang="ts">
// Markup contract: packages/css/src/components/dialog.css
import { computed, ref, useId, useSlots } from 'vue';
import PlinthIconButton from './PlinthIconButton.vue';
import { dialogSidePhone, type DialogSidePhone } from './dialog';
import { hasContent } from './slots';
import { useSwipeToClose } from './swipe';

const props = withDefaults(
  defineProps<{
    /** The dialog's id; one is generated when it is missing. */
    id?: string;
    /** The heading, and the dialog's accessible name. */
    title: string;
    /** A line under the title, and the dialog's accessible description. */
    description?: string;
    /** The close button's accessible name. */
    closeLabel?: string;
    /** Whether the close button, Escape and the backdrop close it; false makes an alert dialog. */
    dismissible?: boolean;
    /** How it shows below 768px: centred, or a bottom sheet. */
    sidePhone?: DialogSidePhone;
  }>(),
  {
    id: undefined,
    description: undefined,
    closeLabel: 'Close',
    dismissible: true,
    sidePhone: 'center',
  },
);

const emit = defineEmits<{
  /** The dialog closed: its buttons, the close button, Escape, the backdrop or close(). */
  close: [event: Event];
}>();

if (!props.title?.trim()) {
  throw new Error("<PlinthDialog> needs a title: it is the dialog's accessible name.");
}

const slots = useSlots();
const generatedId = useId();
const dialogId = computed(() => props.id?.trim() || `plinth-dialog-${generatedId}`);
const side = computed(() => dialogSidePhone(props.sidePhone));
const hasDescription = computed(() => Boolean(props.description?.trim()));

const dialog = ref<HTMLDialogElement>();
// A bottom panel on a phone is dragged down to close (modal.css).
useSwipeToClose(dialog);

defineExpose({
  /** Opens the dialog as a modal. */
  showModal: () => dialog.value?.showModal(),
  /** Closes the dialog; it fires `close`. */
  close: () => dialog.value?.close(),
});
</script>

<template>
  <dialog
    :id="dialogId"
    ref="dialog"
    class="plinth-dialog"
    :role="dismissible ? undefined : 'alertdialog'"
    :data-side-phone="side === 'center' ? undefined : side"
    :closedby="dismissible ? 'any' : 'closerequest'"
    :aria-labelledby="`${dialogId}-title`"
    :aria-describedby="hasDescription ? `${dialogId}-description` : undefined"
    @close="emit('close', $event)"
  >
    <div class="plinth-dialog-panel">
      <div
        v-if="dismissible && side === 'bottom'"
        class="plinth-dialog-handle"
        aria-hidden="true"
      ></div>
      <div class="plinth-dialog-header">
        <h2 :id="`${dialogId}-title`" class="plinth-dialog-title">{{ title }}</h2>
        <p v-if="hasDescription" :id="`${dialogId}-description`" class="plinth-dialog-description">
          {{ description }}
        </p>
        <PlinthIconButton
          v-if="dismissible"
          class="plinth-dialog-close"
          :label="closeLabel"
          variant="ghost"
          :commandfor="dialogId"
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
      <div class="plinth-dialog-body"><slot /></div>
      <div v-if="hasContent(slots.footer?.())" class="plinth-dialog-footer">
        <slot name="footer" />
      </div>
    </div>
  </dialog>
</template>
