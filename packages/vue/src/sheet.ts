/**
 * The edge a sheet comes from. `end` is the default; `start` and `end` are logical, so they swap
 * in right-to-left text. The same list is the side on a phone (`sidePhone`), which has no default.
 */
export const sheetSides = ['start', 'end', 'top', 'bottom'] as const;
export type SheetSide = (typeof sheetSides)[number];

/** A side from the list, or `end` when it is not one of them. */
export function sheetSide(value: string | undefined): SheetSide {
  return sheetSidePhone(value) ?? 'end';
}

/** A side from the list, or nothing (no `data-side-phone`) when it is not one of them. */
export function sheetSidePhone(value: string | undefined): SheetSide | undefined {
  return sheetSides.includes(value as SheetSide) ? (value as SheetSide) : undefined;
}

/** The close button's icon, a cross. Blade's sheet prints the same markup. */
export const sheetCloseIcon =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>';
