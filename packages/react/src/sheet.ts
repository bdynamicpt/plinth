/** Where the sheet shows from 768px up. `center` is the default; on a phone both are a bottom sheet. */
export const sheetPlacements = ['center', 'end'] as const;
export type SheetPlacement = (typeof sheetPlacements)[number];

/** A placement from the list, or `center` when it is not one of them. */
export function sheetPlacement(value: string | undefined): SheetPlacement {
  return sheetPlacements.includes(value as SheetPlacement) ? (value as SheetPlacement) : 'center';
}

/** The close button's icon, a cross. Blade's sheet prints the same markup. */
export const sheetCloseIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
