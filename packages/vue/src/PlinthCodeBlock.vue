<script setup lang="ts">
// Markup contract: packages/css/src/components/code-block.css
import { computed, onBeforeUnmount, onMounted, ref, useId, useSlots } from 'vue';
import PlinthButton from './PlinthButton.vue';
import { checkedTab, codeBlockTabs, codeBlockText, type CodeBlockTab } from './code-block';
import { hasContent } from './slots';

const props = withDefaults(
  defineProps<{
    /** The root's id; the tabs' name is this id with -language. One is generated when missing. */
    id?: string;
    /** A file name or a short label above the code (the label slot takes markup). */
    label?: string;
    /** The highlighter's markup for the code (trusted, not escaped), in place of the slot. */
    html?: string;
    /** Language tabs (up to six), each with its own code; the slot is then not used. */
    tabs?: CodeBlockTab[];
    /** The tab that starts checked (later the browser keeps it); the first when unknown. */
    selected?: string;
    /** The tabs' accessible name. */
    tabsLabel?: string;
    /** Shows the copy button. */
    copy?: boolean;
    copyLabel?: string;
    /** What the button and the status say for two seconds after copying. */
    copiedLabel?: string;
  }>(),
  {
    id: undefined,
    label: undefined,
    html: undefined,
    tabs: () => [],
    selected: undefined,
    tabsLabel: 'Language',
    copy: true,
    copyLabel: 'Copy',
    copiedLabel: 'Copied',
  },
);

const emit = defineEmits<{
  /** The code was copied to the clipboard. */
  copied: [text: string];
}>();

const slots = useSlots();
const generatedId = useId();
const rootId = computed(() => props.id?.trim() || undefined);
const name = computed(() => `${rootId.value ?? `plinth-code-block-${generatedId}`}-language`);
const shownTabs = computed(() => codeBlockTabs(props.tabs));
// Only the first tab to show is the app's: after that the radios keep the reader's choice.
const checked = checkedTab(codeBlockTabs(props.tabs), props.selected);

// The clipboard is only there in the browser, so the button shows once mounted.
const canCopy = ref(false);
const copied = ref(false);
let timer: ReturnType<typeof setTimeout> | undefined;

onMounted(() => {
  canCopy.value = Boolean(navigator.clipboard);
});
onBeforeUnmount(() => clearTimeout(timer));

async function copyCode(event: MouseEvent) {
  const text = codeBlockText(event.currentTarget as Element);
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    return;
  }
  copied.value = true;
  clearTimeout(timer);
  timer = setTimeout(() => (copied.value = false), 2000);
  emit('copied', text);
}
</script>

<template>
  <div :id="rootId" class="plinth-code-block">
    <div class="plinth-code-block-header">
      <!-- Checked as it renders: slots aren't reactive, and the parent may add the label later. -->
      <span v-if="hasContent(slots.label?.())" class="plinth-code-block-label"
        ><slot name="label"
      /></span>
      <span v-else-if="label?.trim()" class="plinth-code-block-label">{{ label }}</span>
      <div
        v-if="shownTabs.length"
        class="plinth-code-block-tabs"
        role="radiogroup"
        :aria-label="tabsLabel"
      >
        <label v-for="(tab, i) in shownTabs" :key="i" class="plinth-code-block-tab"
          ><input
            type="radio"
            class="plinth-code-block-tab-input"
            :name="name"
            :checked="i === checked"
          /><span class="plinth-code-block-tab-label">{{ tab.label }}</span></label
        >
      </div>
      <template v-if="copy">
        <PlinthButton
          class="plinth-code-block-copy"
          variant="ghost"
          size="sm"
          :hidden="!canCopy"
          @click="copyCode"
          >{{ copied ? copiedLabel : copyLabel }}</PlinthButton
        >
        <span class="plinth-code-block-status" role="status">{{ copied ? copiedLabel : '' }}</span>
      </template>
    </div>
    <template v-if="shownTabs.length">
      <template v-for="(tab, i) in shownTabs" :key="i">
        <pre
          v-if="tab.html !== undefined"
          class="plinth-code-block-code"
          dir="ltr"
          tabindex="0"
        ><code v-html="tab.html"></code></pre>
        <pre
          v-else
          class="plinth-code-block-code"
          dir="ltr"
          tabindex="0"
        ><code>{{ tab.code }}</code></pre>
      </template>
    </template>
    <pre
      v-else-if="html !== undefined"
      class="plinth-code-block-code"
      dir="ltr"
      tabindex="0"
    ><code v-html="html"></code></pre>
    <pre v-else class="plinth-code-block-code" dir="ltr" tabindex="0"><code><slot /></code></pre>
  </div>
</template>
