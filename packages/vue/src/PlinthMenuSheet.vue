<script setup lang="ts">
// Markup contract: packages/css/src/components/menu-sheet.css
import { computed, ref, useId, useSlots } from 'vue';
import PlinthAvatar from './PlinthAvatar.vue';
import PlinthListRow from './PlinthListRow.vue';
import PlinthSheet from './PlinthSheet.vue';
import { hasContent } from './slots';

const props = withDefaults(
  defineProps<{
    /** The dialog's id, for the menu button's commandfor; one is generated when it is missing. */
    id?: string;
    /** The heading, and the sheet's and the navigation's accessible name. */
    title?: string;
    /** The close button's accessible name. */
    closeLabel?: string;
    /** The signed-in user's name; leave it out for no user row. */
    userName?: string;
    /** A second line under the name: an email or a role. */
    userDetail?: string;
    /** The user's picture; initials from the name stand in without it. */
    userSrc?: string;
    /** Makes the user row a link, to the profile. */
    userHref?: string;
  }>(),
  {
    id: undefined,
    title: 'Menu',
    closeLabel: 'Close',
    userName: undefined,
    userDetail: undefined,
    userSrc: undefined,
    userHref: undefined,
  },
);

const emit = defineEmits<{
  /** The menu closed: the close button, Escape, the backdrop or close(). */
  close: [event: Event];
}>();

const slots = useSlots();
const generatedId = useId();
const menuId = computed(() => props.id?.trim() || `plinth-menu-sheet-${generatedId}`);
const hasUser = computed(() => Boolean(props.userName?.trim()));
const userHref = computed(() => (props.userHref?.trim() ? props.userHref : undefined));
const userDetail = computed(() => (props.userDetail?.trim() ? props.userDetail : undefined));

const sheet = ref<InstanceType<typeof PlinthSheet>>();

defineExpose({
  /** Opens the menu as a modal dialog. */
  showModal: () => sheet.value?.showModal(),
  /** Closes the menu; it emits `close`. */
  close: () => sheet.value?.close(),
});
</script>

<template>
  <PlinthSheet
    :id="menuId"
    ref="sheet"
    class="plinth-menu-sheet"
    :title="title"
    :close-label="closeLabel"
    placement="end"
    @close="emit('close', $event)"
  >
    <PlinthListRow
      v-if="hasUser"
      class="plinth-menu-sheet-user"
      :description="userDetail"
      :href="userHref"
      :chevron="Boolean(userHref)"
    >
      <template #leading
        ><PlinthAvatar :name="userName" :src="userSrc" size="lg" decorative
      /></template>
      <template #default>{{ userName }}</template>
    </PlinthListRow>
    <nav class="plinth-menu-sheet-nav" :aria-labelledby="`${menuId}-title`"><slot /></nav>
    <div v-if="hasContent(slots.account?.())" class="plinth-menu-sheet-account">
      <slot name="account" />
    </div>
  </PlinthSheet>
</template>
