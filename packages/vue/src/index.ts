import type { App, Plugin } from 'vue';
import PlinthBadge from './PlinthBadge.vue';

export { PlinthBadge };
export { tones, type Tone } from './tones';

/** Registers every Plinth component globally: `app.use(Plinth)`. */
export const Plinth: Plugin = {
  install(app: App) {
    app.component('PlinthBadge', PlinthBadge);
  },
};
