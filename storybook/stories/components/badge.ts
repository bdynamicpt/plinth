import { tones, type Tone } from '@bdynamic/plinth-vue';

export { tones, type Tone };

export interface BadgeArgs {
  label: string;
  tone: Tone;
  dot: boolean;
}

const escape = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** The badge's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function badge({ label, tone, dot }: BadgeArgs): string {
  return [
    `<span class="plinth-badge" data-tone="${tone}">`,
    dot ? '<span class="plinth-badge-dot" aria-hidden="true"></span>' : '',
    `<span class="plinth-badge-label">${escape(label)}</span>`,
    '</span>',
  ].join('');
}
