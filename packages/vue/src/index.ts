import type { App, Plugin } from 'vue';
import PlinthAvatar from './PlinthAvatar.vue';
import PlinthBadge from './PlinthBadge.vue';
import PlinthButton from './PlinthButton.vue';
import PlinthCallout from './PlinthCallout.vue';
import PlinthCodeBlock from './PlinthCodeBlock.vue';
import PlinthDataTable from './PlinthDataTable.vue';
import PlinthDataTableCell from './PlinthDataTableCell.vue';
import PlinthDataTableColumn from './PlinthDataTableColumn.vue';
import PlinthDataTableEmpty from './PlinthDataTableEmpty.vue';
import PlinthDataTableRow from './PlinthDataTableRow.vue';
import PlinthDataTableSort from './PlinthDataTableSort.vue';
import PlinthDialog from './PlinthDialog.vue';
import PlinthHeader from './PlinthHeader.vue';
import PlinthIcon from './PlinthIcon.vue';
import PlinthIconButton from './PlinthIconButton.vue';
import PlinthListCard from './PlinthListCard.vue';
import PlinthListRow from './PlinthListRow.vue';
import PlinthMenuSheet from './PlinthMenuSheet.vue';
import PlinthPill from './PlinthPill.vue';
import PlinthPillRow from './PlinthPillRow.vue';
import PlinthSectionMenu from './PlinthSectionMenu.vue';
import PlinthSectionMenuItem from './PlinthSectionMenuItem.vue';
import PlinthSheet from './PlinthSheet.vue';

export {
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthCallout,
  PlinthCodeBlock,
  PlinthDataTable,
  PlinthDataTableCell,
  PlinthDataTableColumn,
  PlinthDataTableEmpty,
  PlinthDataTableRow,
  PlinthDataTableSort,
  PlinthDialog,
  PlinthHeader,
  PlinthIcon,
  PlinthIconButton,
  PlinthListCard,
  PlinthListRow,
  PlinthMenuSheet,
  PlinthPill,
  PlinthPillRow,
  PlinthSectionMenu,
  PlinthSectionMenuItem,
  PlinthSheet,
};
export { avatarGlyph, avatarSizes, initialsFrom, type AvatarSize } from './avatar';
export { buttonVariants, type ButtonVariant } from './button';
export {
  calloutIcons,
  calloutRole,
  calloutRoles,
  calloutTone,
  calloutTones,
  type CalloutRole,
  type CalloutTone,
} from './callout';
export { type CodeBlockTab } from './code-block';
export {
  dataTableCellKind,
  dataTableCellKinds,
  dataTableSort,
  dataTableSortIcon,
  dataTableSorts,
  type DataTableCellKind,
  type DataTableSort,
} from './data-table';
export { dialogCloseIcon, dialogSidePhone, dialogSidePhones, type DialogSidePhone } from './dialog';
export { headingLevel, headingLevels, type HeadingLevel } from './heading';
export { controlSizes, iconSizeFor, resolveSize, sizes, type ControlSize, type Size } from './size';
export { iconSizes, type IconSize } from './icon';
export { listRowChevron } from './list-row';
export { sheetCloseIcon, sheetPlacement, sheetPlacements, type SheetPlacement } from './sheet';
export { tones, type Tone } from './tones';

/** Registers every Plinth component globally: `app.use(Plinth)`. */
export const Plinth: Plugin = {
  install(app: App) {
    app.component('PlinthAvatar', PlinthAvatar);
    app.component('PlinthBadge', PlinthBadge);
    app.component('PlinthButton', PlinthButton);
    app.component('PlinthCallout', PlinthCallout);
    app.component('PlinthCodeBlock', PlinthCodeBlock);
    app.component('PlinthDataTable', PlinthDataTable);
    app.component('PlinthDataTableCell', PlinthDataTableCell);
    app.component('PlinthDataTableColumn', PlinthDataTableColumn);
    app.component('PlinthDataTableEmpty', PlinthDataTableEmpty);
    app.component('PlinthDataTableRow', PlinthDataTableRow);
    app.component('PlinthDataTableSort', PlinthDataTableSort);
    app.component('PlinthDialog', PlinthDialog);
    app.component('PlinthHeader', PlinthHeader);
    app.component('PlinthIcon', PlinthIcon);
    app.component('PlinthIconButton', PlinthIconButton);
    app.component('PlinthListCard', PlinthListCard);
    app.component('PlinthListRow', PlinthListRow);
    app.component('PlinthMenuSheet', PlinthMenuSheet);
    app.component('PlinthPill', PlinthPill);
    app.component('PlinthPillRow', PlinthPillRow);
    app.component('PlinthSectionMenu', PlinthSectionMenu);
    app.component('PlinthSectionMenuItem', PlinthSectionMenuItem);
    app.component('PlinthSheet', PlinthSheet);
  },
};
