/** The tones a component such as the badge accepts. The first one is the default. */
export const tones = ['neutral', 'success', 'warning', 'danger'] as const;

export type Tone = (typeof tones)[number];

/** A tone from the list, or the default when it is not one of them. */
export function tone(value: string | undefined): Tone {
  return tones.includes(value as Tone) ? (value as Tone) : tones[0];
}
