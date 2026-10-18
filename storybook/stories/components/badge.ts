import { tones, type Tone } from '@bdynamic/plinth-vue';

export { tones, type Tone };

export interface BadgeArgs {
  label: string;
  tone: Tone;
  dot: boolean;
}

const escape = (text: string) => text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/** Extra attributes a project puts on the badge; they land on its root, and `class` is added. */
export type Attributes = Record<string, string>;

/** The badge's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function badge({ label, tone, dot }: BadgeArgs, attributes: Attributes = {}): string {
  const { class: extraClass, ...rest } = attributes;
  const extra = Object.entries(rest)
    .map(([name, value]) => ` ${name}="${escape(value)}"`)
    .join('');
  const classes = ['plinth-badge', extraClass].filter(Boolean).join(' ');
  return [
    `<span class="${classes}" data-tone="${tone}"${extra}>`,
    dot ? '<span class="plinth-badge-dot" aria-hidden="true"></span>' : '',
    `<span class="plinth-badge-label">${escape(label)}</span>`,
    '</span>',
  ].join('');
}
