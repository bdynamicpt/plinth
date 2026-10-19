import { button } from './button.ts';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export interface CodeBlockTab {
  /** The tab's name: a language or a layer (Blade, Vue, React, HTML). */
  label: string;
  /** The tab's code, as text. */
  code: string;
  /** The highlighter's markup for the tab's code (trusted, not escaped), in place of `code`. */
  html?: string;
}

export interface CodeBlockArgs {
  /** The root's id; the tabs' name is this id with -language. */
  id?: string;
  /** A file name or a short label above the code. */
  label?: string;
  /** A label with a little markup, such as a badge (trusted, not escaped), in place of `label`. */
  labelHtml?: string;
  /** The code, as text, for a block without tabs. */
  code: string;
  /** The highlighter's markup for the code (trusted, not escaped), in place of `code`. */
  html?: string;
  /** Language tabs, each with its own code; the slot's code is then not used. */
  tabs?: CodeBlockTab[];
  /** The label of the tab that starts checked; the first when it is missing or unknown. */
  selected?: string;
  /** The radio group's accessible name. */
  tabsLabel: string;
  /** Prints the copy button and its status. */
  copy: boolean;
  copyLabel: string;
  copiedLabel: string;
}

const pre = (content: string) =>
  `<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>${content}</code></pre>`;

/** The code block's markup contract. Blade, Vue and React must print exactly this (see parity.test.ts). */
export function codeBlock(
  {
    id,
    label,
    labelHtml,
    code,
    html,
    tabs: allTabs = [],
    selected,
    tabsLabel,
    copy,
    copyLabel,
  }: CodeBlockArgs,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-code-block', attributes);
  // The CSS shows the code of the first six tabs, so a block has at most six.
  const tabs = allTabs.slice(0, 6);
  const labelContent = labelHtml?.trim() ? labelHtml : label?.trim() ? escape(label) : '';
  const name = `${id?.trim() || 'plinth-code-block'}-language`;
  const checked = Math.max(
    0,
    tabs.findIndex((tab) => tab.label === selected),
  );
  const tabGroup = tabs.length
    ? [
        `<div class="plinth-code-block-tabs" role="radiogroup" aria-label="${escape(tabsLabel)}">`,
        ...tabs.map(
          (tab, i) =>
            `<label class="plinth-code-block-tab"><input type="radio" class="plinth-code-block-tab-input" name="${escape(name)}"${i === checked ? ' checked' : ''}><span class="plinth-code-block-tab-label">${escape(tab.label)}</span></label>`,
        ),
        '</div>',
      ].join('')
    : '';
  const copyButton = copy
    ? button(
        {
          label: copyLabel,
          variant: 'ghost',
          size: 'sm',
          disabled: false,
          busy: false,
        },
        { class: 'plinth-code-block-copy', hidden: '' },
      ) + '<span class="plinth-code-block-status" role="status"></span>'
    : '';
  const panels = tabs.length
    ? tabs.map((tab) => pre(tab.html ?? escape(tab.code))).join('')
    : pre(html ?? escape(code));
  return [
    `<div${id?.trim() ? ` id="${escape(id.trim())}"` : ''} class="${classes}"${extra}>`,
    '<div class="plinth-code-block-header">',
    labelContent ? `<span class="plinth-code-block-label">${labelContent}</span>` : '',
    tabGroup,
    copyButton,
    '</div>',
    panels,
    '</div>',
  ].join('');
}
