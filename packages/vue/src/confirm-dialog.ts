/**
 * What the confirmation dialog asks for: `simple` (the default) asks only, `type` asks for a
 * phrase typed exactly, `password` asks for the person's password, which the app checks.
 */
export const confirmDialogKinds = ['simple', 'type', 'password'] as const;
export type ConfirmDialogKind = (typeof confirmDialogKinds)[number];

/** A kind from the list, or `simple` when it is not one of them. */
export function confirmDialogKind(value: string | undefined): ConfirmDialogKind {
  return confirmDialogKinds.includes(value as ConfirmDialogKind)
    ? (value as ConfirmDialogKind)
    : 'simple';
}

/** The confirm button's tone: `neutral` (the default, a primary button) or `danger`. */
export const confirmDialogTones = ['neutral', 'danger'] as const;
export type ConfirmDialogTone = (typeof confirmDialogTones)[number];

/** A tone from the list, or `neutral` when it is not one of them. */
export function confirmDialogTone(value: string | undefined): ConfirmDialogTone {
  return confirmDialogTones.includes(value as ConfirmDialogTone)
    ? (value as ConfirmDialogTone)
    : 'neutral';
}

/** The field's label when the app gives none; `:phrase` is where the phrase goes. */
export const confirmDialogFieldLabels = {
  type: 'Type :phrase to confirm',
  password: 'Password',
} as const;

/**
 * The input's pattern: the phrase with the characters a pattern (a `v`-flag regular expression)
 * treats as syntax escaped, so the browser accepts exactly the phrase.
 */
export const confirmDialogPattern = (phrase: string): string =>
  phrase.replace(/[\\^$.*+?()[\]{}|/]/g, '\\$&');
