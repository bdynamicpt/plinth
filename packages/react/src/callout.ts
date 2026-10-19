/** The callout's tones. `neutral` is the default. */
export const calloutTones = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
export type CalloutTone = (typeof calloutTones)[number];

/** A tone from the list, or `neutral` when it is not one of them. */
export function calloutTone(value: string | undefined): CalloutTone {
  return calloutTones.includes(value as CalloutTone) ? (value as CalloutTone) : 'neutral';
}

/**
 * The callout's roles: `note` (the default) for a note in the page, `status` for a message the
 * app adds after something happens, `alert` for an urgent one. Assistive technology announces the
 * last two when they appear.
 */
export const calloutRoles = ['note', 'status', 'alert'] as const;
export type CalloutRole = (typeof calloutRoles)[number];

/** A role from the list, or `note` when it is not one of them. */
export function calloutRole(value: string | undefined): CalloutRole {
  return calloutRoles.includes(value as CalloutRole) ? (value as CalloutRole) : 'note';
}

const glyph = (paths: string) =>
  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

/**
 * Each tone's icon, a different shape for each, so the tone never rests on colour alone. Blade's
 * CalloutTone::icon() prints the same markup; the icon slot replaces it.
 */
export const calloutIcons: Record<CalloutTone, string> = {
  neutral: glyph(
    '<rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M9 9h6M9 13h6M9 17h3"></path>',
  ),
  info: glyph('<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 7.5v.01"></path>'),
  success: glyph('<circle cx="12" cy="12" r="9"></circle><path d="M8 12.5l2.5 2.5L16 9.5"></path>'),
  warning: glyph(
    '<path d="M10.3 4.3L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"></path><path d="M12 9.5v4M12 17v.01"></path>',
  ),
  danger: glyph(
    '<path d="M8.5 3h7L21 8.5v7L15.5 21h-7L3 15.5v-7z"></path><path d="M12 7.5v5M12 16v.01"></path>',
  ),
};
