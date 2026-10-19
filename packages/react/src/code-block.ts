/** A language tab: its name (Blade, Vue, React, HTML) and its code, as text. */
export interface CodeBlockTab {
  label: string;
  code: string;
}

/** The index of the tab that starts checked: the one labelled `selected`, or the first. */
export const checkedTab = (tabs: readonly CodeBlockTab[], selected: string | undefined): number =>
  Math.max(
    0,
    tabs.findIndex((tab) => tab.label === selected),
  );

/**
 * The text a code block's copy button copies: the code of the checked tab's <pre>, or of the only
 * one. Vue's layer and Blade's Alpine do the same.
 */
export function codeBlockText(button: Element): string {
  const block = button.closest('.plinth-code-block');
  const inputs = [...(block?.querySelectorAll('.plinth-code-block-tab-input') ?? [])];
  const index = Math.max(
    0,
    inputs.findIndex((input) => (input as HTMLInputElement).checked),
  );
  return block?.querySelectorAll('.plinth-code-block-code')[index]?.textContent ?? '';
}
