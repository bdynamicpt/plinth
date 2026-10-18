import type { App, Plugin } from 'vue';
import PlinthBadge from './PlinthBadge.vue';
import PlinthButton from './PlinthButton.vue';
import PlinthIcon from './PlinthIcon.vue';
import PlinthIconButton from './PlinthIconButton.vue';

export { PlinthBadge, PlinthButton, PlinthIcon, PlinthIconButton };
export { buttonVariants, type ButtonVariant } from './button';
export { controlSizes, iconSizeFor, resolveSize, sizes, type ControlSize, type Size } from './size';
export { iconSizes, type IconSize } from './icon';
export { tones, type Tone } from './tones';

/** Registers every Plinth component globally: `app.use(Plinth)`. */
export const Plinth: Plugin = {
  install(app: App) {
    app.component('PlinthBadge', PlinthBadge);
    app.component('PlinthButton', PlinthButton);
    app.component('PlinthIcon', PlinthIcon);
    app.component('PlinthIconButton', PlinthIconButton);
  },
};
