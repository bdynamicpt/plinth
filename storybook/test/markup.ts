import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { JSDOM } from 'jsdom';
import { createElement, type ReactNode } from 'react';

const collapse = (value: string): string => value.replace(/\s+/g, ' ').trim();

/** A style attribute's declarations as `property: value; …`, however they were spaced. */
const style = (value: string): string =>
  value
    .split(';')
    .map((declaration) => declaration.split(/:(.*)/s).slice(0, 2).map(collapse).join(': '))
    .filter((declaration) => declaration !== '')
    .join('; ');

/**
 * Canonical form of some HTML, for comparing markup from different sources: attributes are
 * sorted, whitespace is collapsed (and dropped between tags, and around a style's colons and
 * semicolons), and comments are removed.
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
      .map(({ name, value }) => ` ${name}="${name === 'style' ? style(value) : collapse(value)}"`)
      .sort()
      .join('');
    return `<${tag}${attributes}>${[...element.childNodes].map(print).join('')}</${tag}>`;
  };

  return [...template.content.childNodes].map(print).join('');
}

/**
 * Some markup without its Alpine attributes (`x-data`, `x-on:click`, …). They are how the Blade
 * layer adds what the platform can't do (ADR 2), such as the code block's copy button, and are not
 * part of the contract; Pest checks them.
 */
export function withoutAlpine(html: string): string {
  const { document } = new JSDOM('').window;
  const template = document.createElement('template');
  template.innerHTML = html;
  for (const element of template.content.querySelectorAll('*')) {
    for (const { name } of [...element.attributes]) {
      if (name.startsWith('x-')) element.removeAttribute(name);
    }
  }
  return template.innerHTML;
}

export interface BladeCase {
  component: string;
  props: Record<string, unknown>;
  attributes?: Record<string, string>;
  slot: string;
  /** Named slots, as markup: `{ icon: '<svg>…</svg>' }`. */
  named?: Record<string, string>;
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

/**
 * A React prop name for an HTML attribute: `class` is `className`, `for` is `htmlFor`,
 * `readonly` is `readOnly`, `tabindex` is `tabIndex`, and a
 * dashed SVG attribute such as `stroke-width` is camel case. `data-*` and `aria-*` stay as they
 * are.
 */
export function reactProp(name: string): string {
  if (name === 'class') return 'className';
  if (name === 'for') return 'htmlFor';
  if (name === 'readonly') return 'readOnly';
  if (name === 'tabindex') return 'tabIndex';
  if (name.startsWith('data-') || name.startsWith('aria-')) return name;
  return name.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

/** HTML attributes as React props (see `reactProp`). */
export function reactProps(attributes: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(attributes).map(([name, value]) => [reactProp(name), value]),
  );
}

/** The boolean attributes the stories' markup uses, as React props. */
const booleanAttributes = ['disabled', 'hidden', 'checked', 'open', 'required', 'readOnly'];

/**
 * A style attribute as React's style object: `margin-block: 1rem` is `marginBlock`, and a custom
 * property such as `--plinth-x` stays as it is.
 */
export function reactStyle(style: string): Record<string, string> {
  return Object.fromEntries(
    style
      .split(';')
      .map((declaration) => declaration.split(/:(.*)/s).map((part) => part.trim()))
      .filter(([property, value]) => property && value)
      .map(([property, value]) => [
        property!.startsWith('--') ? property! : reactProp(property!),
        value!,
      ]),
  );
}

/**
 * Some markup (a story's SVG icon) as React elements, so a parity case can pass it as children
 * or as a node prop, the way a project passes its own icon component.
 */
export function htmlToReact(html: string): ReactNode {
  const { document, Node } = new JSDOM('').window;
  const template = document.createElement('template');
  template.innerHTML = html;

  const convert = (node: globalThis.Node, key: number): ReactNode => {
    if (node.nodeType === Node.TEXT_NODE) return node.textContent;
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const element = node as Element;
    const props = reactProps(
      Object.fromEntries([...element.attributes].map(({ name, value }) => [name, value])),
    );
    // React takes a boolean attribute as true, and the style as an object.
    for (const name of booleanAttributes) {
      if (name in props) props[name] = true;
    }
    if (typeof props.style === 'string') props.style = reactStyle(props.style);
    const children = [...element.childNodes].map(convert);
    return createElement(element.localName, { ...props, key }, ...children);
  };

  const nodes = [...template.content.childNodes].map(convert);
  return nodes.length === 1 ? nodes[0] : nodes;
}
