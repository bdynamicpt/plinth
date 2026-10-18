import type { App, Plugin } from 'vue';
import PlinthBadge from './PlinthBadge.vue';
import PlinthIcon from './PlinthIcon.vue';

export { PlinthBadge, PlinthIcon };
export { iconSizes, type IconSize } from './icon';
export { tones, type Tone } from './tones';

/** Registers every Plinth component globally: `app.use(Plinth)`. */
export const Plinth: Plugin = {
  install(app: App) {
    app.component('PlinthBadge', PlinthBadge);
    app.component('PlinthIcon', PlinthIcon);
  },
};
