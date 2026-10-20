import { sheetCloseIcon, sheetSide, sheetSidePhone, type SheetSide } from '@bdynamic/plinth-vue';
import { iconButton } from './icon-button.ts';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface SheetArgs {
  /** The dialog's id: commandfor and aria-labelledby point at it. */
  id: string;
  /** The heading, and the sheet's accessible name. */
  title: string;
  /** A line under the title, and the sheet's accessible description. */
  description?: string;
  /** The close button's accessible name. */
  closeLabel: string;
  /** The edge the sheet comes from, at every width; start and end are logical. */
  side: SheetSide;
  /** The edge below 768px, when it is another one. */
  sidePhone?: SheetSide;
  /** The body's content (trusted markup, not escaped). */
  body: string;
  /** The footer's content, usually its actions (trusted markup). */
  footer?: string;
}

/** The sheet's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function sheet(
  { id, title, description, closeLabel, side, sidePhone, body, footer }: SheetArgs,
  attributes: Attributes = {},
): string {
  // closedby="any" is the default; a project's own closedby (closerequest) replaces it.
  const { closedby = 'any', ...others } = attributes;
  const { classes, extra } = rootAttributes('plinth-sheet', others);
  const hasDescription = Boolean(description?.trim());
  const phone = sheetSidePhone(sidePhone);
  const close = iconButton(
    {
      label: closeLabel,
      variant: 'ghost',
      size: 'md',
      disabled: false,
      busy: false,
      svg: sheetCloseIcon,
    },
    { class: 'plinth-sheet-close', commandfor: id, command: 'close' },
  );
  return [
    `<dialog class="${classes}"${extra} id="${escape(id)}"`,
    ` data-side="${sheetSide(side)}"`,
    phone ? ` data-side-phone="${phone}"` : '',
    ` closedby="${escape(closedby)}" aria-labelledby="${escape(id)}-title"`,
    hasDescription ? ` aria-describedby="${escape(id)}-description"` : '',
    '>',
    '<div class="plinth-sheet-header">',
    `<h2 id="${escape(id)}-title" class="plinth-sheet-title">${escape(title)}</h2>`,
    hasDescription
      ? `<p id="${escape(id)}-description" class="plinth-sheet-description">${escape(description!)}</p>`
      : '',
    close,
    '</div>',
    `<div class="plinth-sheet-body">${body}</div>`,
    footer?.trim() ? `<div class="plinth-sheet-footer">${footer}</div>` : '',
    '</dialog>',
  ].join('');
}
