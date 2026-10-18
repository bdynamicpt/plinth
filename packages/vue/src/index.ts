import type { App, Plugin } from 'vue';
import PlinthAvatar from './PlinthAvatar.vue';
import PlinthBadge from './PlinthBadge.vue';
import PlinthButton from './PlinthButton.vue';
import PlinthHeader from './PlinthHeader.vue';
import PlinthIcon from './PlinthIcon.vue';
import PlinthIconButton from './PlinthIconButton.vue';
import PlinthListCard from './PlinthListCard.vue';
import PlinthListRow from './PlinthListRow.vue';
import PlinthPill from './PlinthPill.vue';
import PlinthPillRow from './PlinthPillRow.vue';
import PlinthSheet from './PlinthSheet.vue';

export {
  PlinthAvatar,
  PlinthBadge,
  PlinthButton,
  PlinthHeader,
  PlinthIcon,
  PlinthIconButton,
  PlinthListCard,
  PlinthListRow,
  PlinthPill,
  PlinthPillRow,
  PlinthSheet,
};
export { avatarGlyph, avatarSizes, initialsFrom, type AvatarSize } from './avatar';
export { buttonVariants, type ButtonVariant } from './button';
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
    app.component('PlinthHeader', PlinthHeader);
    app.component('PlinthIcon', PlinthIcon);
    app.component('PlinthIconButton', PlinthIconButton);
    app.component('PlinthListCard', PlinthListCard);
    app.component('PlinthListRow', PlinthListRow);
    app.component('PlinthPill', PlinthPill);
    app.component('PlinthPillRow', PlinthPillRow);
    app.component('PlinthSheet', PlinthSheet);
  },
};
