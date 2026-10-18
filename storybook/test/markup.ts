import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';

/**
 * Canonical form of some HTML, for comparing markup from different sources: attributes are
 * sorted, whitespace is collapsed (and dropped between tags), and comments are removed.
 */
export function normalize(html: string): string {
  const { document, Node } = new JSDOM('').window;
  const template = document.createElement('template');
  template.innerHTML = html;

  const print = (node: globalThis.Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return (node.textContent ?? '').replace(/\s+/g, ' ').trim();
    }
    if (node.nodeType !== Node.ELEMENT_NODE) {
      return '';
    }
    const element = node as Element;
    const tag = element.tagName.toLowerCase();
    const attributes = [...element.attributes]
      .map(({ name, value }) => ` ${name}="${value.replace(/\s+/g, ' ').trim()}"`)
      .sort()
      .join('');
    return `<${tag}${attributes}>${[...element.childNodes].map(print).join('')}</${tag}>`;
  };

  return [...template.content.childNodes].map(print).join('');
}

export interface BladeCase {
  component: string;
  props: Record<string, unknown>;
  attributes?: Record<string, string>;
  slot: string;
}

const renderScript = fileURLToPath(
  new URL('../../packages/blade/tests/render.php', import.meta.url),
);

/** Renders Blade components through packages/blade/tests/render.php, in one PHP process. */
export function renderBlade(cases: BladeCase[]): string[] {
  const output = execFileSync('php', [renderScript], {
    input: JSON.stringify(cases),
    encoding: 'utf8',
  });
  return JSON.parse(output) as string[];
}
