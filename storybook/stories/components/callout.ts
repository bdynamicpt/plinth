import {
  calloutIcons,
  calloutRoles,
  calloutTones,
  type CalloutRole,
  type CalloutTone,
} from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export { calloutRoles, calloutTones, type CalloutRole, type CalloutTone };

export interface CalloutArgs {
  tone: CalloutTone;
  role: CalloutRole;
  /** A short title above the text. */
  title?: string;
  /** The callout's text. */
  text: string;
  /** Text with a little markup, such as a link or code (trusted, not escaped), in place of `text`. */
  textHtml?: string;
  /** Buttons or links under the text (trusted markup). */
  actions?: string;
  /** The project's own SVG in place of the tone's icon (trusted markup). */
  icon?: string;
}

/** The callout's markup contract. Blade, Vue and React must print exactly this (see parity.test.ts). */
export function callout(
  { tone, role, title, text, textHtml, actions, icon }: CalloutArgs,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-callout', attributes);
  const content = textHtml?.trim() ? textHtml : text.trim() ? escape(text) : '';
  return [
    `<div class="${classes}" data-tone="${tone}" role="${role}"${extra}>`,
    `<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">${icon?.trim() ? icon : calloutIcons[tone]}</span>`,
    '<div class="plinth-callout-body">',
    title?.trim() ? `<p class="plinth-callout-title">${escape(title)}</p>` : '',
    content ? `<div class="plinth-callout-text">${content}</div>` : '',
    actions?.trim() ? `<div class="plinth-callout-actions">${actions}</div>` : '',
    '</div>',
    '</div>',
  ].join('');
}
