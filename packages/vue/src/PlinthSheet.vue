<script setup lang="ts">
// Markup contract: packages/css/src/components/sheet.css
import { computed, ref, useId, useSlots } from 'vue';
import PlinthIconButton from './PlinthIconButton.vue';
import { sheetSide, sheetSidePhone, type SheetSide } from './sheet';
import { hasContent } from './slots';

const props = withDefaults(
  defineProps<{
    /** The dialog's id; one is generated when it is missing. */
    id?: string;
    /** The heading, and the sheet's accessible name. */
    title: string;
    /** A line under the title, and the sheet's accessible description. */
    description?: string;
    /** The close button's accessible name. */
    closeLabel?: string;
    /** The edge the sheet comes from, at every width. */
    side?: SheetSide;
    /** The edge below 768px, when it is another one. */
    sidePhone?: SheetSide;
  }>(),
  {
    id: undefined,
    description: undefined,
    closeLabel: 'Close',
    side: 'end',
    sidePhone: undefined,
  },
);

const emit = defineEmits<{
  /** The dialog closed: the close button, Escape, the backdrop or close(). */
  close: [event: Event];
}>();

if (!props.title?.trim()) {
  throw new Error("<PlinthSheet> needs a title: it is the sheet's accessible name.");
}

const slots = useSlots();
const generatedId = useId();
const sheetId = computed(() => props.id?.trim() || `plinth-sheet-${generatedId}`);
const dataSide = computed(() => sheetSide(props.side));
const dataSidePhone = computed(() => sheetSidePhone(props.sidePhone));
const hasDescription = computed(() => Boolean(props.description?.trim()));

const dialog = ref<HTMLDialogElement>();

defineExpose({
  /** Opens the sheet as a modal dialog. */
  showModal: () => dialog.value?.showModal(),
  /** Closes the sheet; the dialog fires `close`. */
  close: () => dialog.value?.close(),
});
</script>

<template>
  <dialog
    :id="sheetId"
    ref="dialog"
    class="plinth-sheet"
    :data-side="dataSide"
    :data-side-phone="dataSidePhone"
    closedby="any"
    :aria-labelledby="`${sheetId}-title`"
    :aria-describedby="hasDescription ? `${sheetId}-description` : undefined"
    @close="emit('close', $event)"
  >
    <div class="plinth-sheet-header">
      <h2 :id="`${sheetId}-title`" class="plinth-sheet-title">{{ title }}</h2>
      <p v-if="hasDescription" :id="`${sheetId}-description`" class="plinth-sheet-description">
        {{ description }}
      </p>
      <PlinthIconButton
        class="plinth-sheet-close"
        :label="closeLabel"
        variant="ghost"
        :commandfor="sheetId"
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
    <div class="plinth-sheet-body"><slot /></div>
    <div v-if="hasContent(slots.footer?.())" class="plinth-sheet-footer">
      <slot name="footer" />
    </div>
  </dialog>
</template>
