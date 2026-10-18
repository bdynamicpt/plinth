import type { App, Plugin } from 'vue';
import PlinthBadge from './PlinthBadge.vue';
import PlinthButton from './PlinthButton.vue';
import PlinthIcon from './PlinthIcon.vue';

export { PlinthBadge, PlinthButton, PlinthIcon };
export {
  buttonSizes,
  buttonVariants,
  buttonIconSize,
  type ButtonSize,
  type ButtonVariant,
} from './button';
export { iconSizes, type IconSize } from './icon';
export { tones, type Tone } from './tones';

/** Registers every Plinth component globally: `app.use(Plinth)`. */
export const Plinth: Plugin = {
  install(app: App) {
    app.component('PlinthBadge', PlinthBadge);
    app.component('PlinthButton', PlinthButton);
    app.component('PlinthIcon', PlinthIcon);
  },
};
