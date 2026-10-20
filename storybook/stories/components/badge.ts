import { tones, type Tone } from '@bdynamic/plinth-vue';

export { tones, type Tone };

export interface BadgeArgs {
  label: string;
  tone: Tone;
  dot: boolean;
}

import { escape, rootAttributes, type Attributes } from './markup.ts';

export type { Attributes };

/** The badge's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function badge({ label, tone, dot }: BadgeArgs, attributes: Attributes = {}): string {
  const { classes, extra } = rootAttributes('plinth-badge', attributes);
  return [
    `<span class="${classes}"${extra} data-tone="${tone}">`,
    dot ? '<span class="plinth-badge-dot" aria-hidden="true"></span>' : '',
    `<span class="plinth-badge-label">${escape(label)}</span>`,
    '</span>',
  ].join('');
}
