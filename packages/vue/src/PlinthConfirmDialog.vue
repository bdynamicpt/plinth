<script setup lang="ts">
// Markup contract: packages/css/src/components/confirm-dialog.css
import { computed, ref, useId } from 'vue';
import PlinthButton from './PlinthButton.vue';
import {
  confirmDialogFieldLabels,
  confirmDialogKind,
  confirmDialogPattern,
  confirmDialogTone,
  type ConfirmDialogKind,
  type ConfirmDialogTone,
} from './confirm-dialog';
import { dialogSidePhone, type DialogSidePhone } from './dialog';

const props = withDefaults(
  defineProps<{
    /** The dialog's id; one is generated when it is missing. */
    id?: string;
    /** The question, and the dialog's accessible name. */
    title: string;
    /** What happens if the person confirms, and the dialog's accessible description. */
    message: string;
    /** What it asks for: only a yes, a phrase typed exactly, or the person's password. */
    kind?: ConfirmDialogKind;
    /** The phrase to type, for the type-to-confirm kind. */
    phrase?: string;
    /** The field's label; `:phrase` shows the phrase in it. Each kind has a default. */
    fieldLabel?: string;
    /** The confirm button's label. */
    confirmLabel?: string;
    /** The cancel button's label. */
    cancelLabel?: string;
    /** danger makes the confirm button the danger variant, for a destructive action. */
    tone?: ConfirmDialogTone;
    /** A message under the field, set by the app (a wrong password). */
    error?: string;
    /** The confirm button is busy while the app checks. */
    busy?: boolean;
    /** How it shows below 768px: centred, or a bottom sheet. */
    sidePhone?: DialogSidePhone;
  }>(),
  {
    id: undefined,
    kind: 'simple',
    phrase: undefined,
    fieldLabel: undefined,
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    tone: 'neutral',
    error: undefined,
    busy: false,
    sidePhone: 'center',
  },
);

const emit = defineEmits<{
  /** The dialog closed: confirmed (returnValue "confirm"), cancelled, Escape or close(). */
  close: [event: Event];
}>();

if (!props.title?.trim()) {
  throw new Error("<PlinthConfirmDialog> needs a title: it is the dialog's accessible name.");
}
if (!props.message?.trim()) {
  throw new Error(
    "<PlinthConfirmDialog> needs a message: it is the dialog's accessible description.",
  );
}

const type = computed(() => confirmDialogKind(props.kind));
if (type.value === 'type' && !props.phrase?.trim()) {
  throw new Error('<PlinthConfirmDialog kind="type"> needs a phrase: it is what the person types.');
}

const generatedId = useId();
const dialogId = computed(() => props.id?.trim() || `plinth-confirm-dialog-${generatedId}`);
const side = computed(() => dialogSidePhone(props.sidePhone));
// The phrase and the field's label are read only when the dialog has a field, the phrase only by
// the type-to-confirm kind, which has one.
const phraseText = computed(() => props.phrase!.trim());
const hasError = computed(() => type.value !== 'simple' && Boolean(props.error?.trim()));
// The label's text around each :phrase; the phrase goes in a <strong> between them.
const labelParts = computed(() => {
  const label =
    props.fieldLabel?.trim() || confirmDialogFieldLabels[type.value as 'type' | 'password'];
  return type.value === 'type' ? label.split(':phrase') : [label];
});

const dialog = ref<HTMLDialogElement>();

defineExpose({
  /** Opens the dialog as a modal. */
  showModal: () => dialog.value?.showModal(),
  /** Closes the dialog; it fires `close`. Pass "confirm" once the app has checked a password. */
  close: (returnValue?: string) => dialog.value?.close(returnValue),
});
</script>

<template>
  <dialog
    :id="dialogId"
    ref="dialog"
    class="plinth-dialog plinth-confirm-dialog"
    role="alertdialog"
    :data-side-phone="side === 'center' ? undefined : side"
    closedby="closerequest"
    :aria-labelledby="`${dialogId}-title`"
    :aria-describedby="`${dialogId}-message`"
    @close="emit('close', $event)"
  >
    <form method="dialog" class="plinth-confirm-dialog-form">
      <div class="plinth-dialog-header">
        <h2 :id="`${dialogId}-title`" class="plinth-dialog-title">{{ title }}</h2>
      </div>
      <div class="plinth-dialog-body">
        <p :id="`${dialogId}-message`" class="plinth-confirm-dialog-message">{{ message }}</p>
        <div v-if="type !== 'simple'" class="plinth-confirm-dialog-field">
          <label :for="`${dialogId}-field`" class="plinth-confirm-dialog-label"
            ><template v-for="(part, n) in labelParts" :key="n"
              ><strong v-if="n > 0">{{ phraseText }}</strong
              >{{ part }}</template
            ></label
          >
          <input
            v-if="type === 'type'"
            :id="`${dialogId}-field`"
            class="plinth-confirm-dialog-input"
            type="text"
            name="confirmation"
            required
            :pattern="confirmDialogPattern(phraseText)"
            autocomplete="off"
            autocapitalize="none"
            spellcheck="false"
            :aria-invalid="hasError ? 'true' : undefined"
            :aria-describedby="hasError ? `${dialogId}-error` : undefined"
          />
          <input
            v-else
            :id="`${dialogId}-field`"
            class="plinth-confirm-dialog-input"
            type="password"
            name="password"
            required
            autocomplete="current-password"
            :aria-invalid="hasError ? 'true' : undefined"
            :aria-describedby="hasError ? `${dialogId}-error` : undefined"
          />
        </div>
        <p
          v-if="hasError"
          :id="`${dialogId}-error`"
          class="plinth-confirm-dialog-error"
          role="alert"
        >
          {{ error }}
        </p>
      </div>
      <div class="plinth-dialog-footer">
        <PlinthButton variant="secondary" :commandfor="dialogId" command="close">{{
          cancelLabel
        }}</PlinthButton>
        <PlinthButton
          class="plinth-confirm-dialog-confirm"
          type="submit"
          value="confirm"
          :variant="confirmDialogTone(tone) === 'danger' ? 'danger' : 'primary'"
          :busy="busy"
          >{{ confirmLabel }}</PlinthButton
        >
      </div>
    </form>
  </dialog>
</template>
