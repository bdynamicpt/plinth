import { sheetCloseIcon } from './sheet';

/**
 * How the dialog shows below 768px: `center` (the default, printed as no attribute) or `bottom`,
 * a bottom sheet. From 768px up every dialog is centred.
 */
export const dialogSidePhones = ['center', 'bottom'] as const;
export type DialogSidePhone = (typeof dialogSidePhones)[number];

/** A side from the list, or `center` when it is not one of them. */
export function dialogSidePhone(value: string | undefined): DialogSidePhone {
  return dialogSidePhones.includes(value as DialogSidePhone)
    ? (value as DialogSidePhone)
    : 'center';
}

/** The close button's icon, the same cross as the sheet's. Blade's dialog prints the same markup. */
export const dialogCloseIcon = sheetCloseIcon;
