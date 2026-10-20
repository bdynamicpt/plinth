import { Fragment, isValidElement, type ReactNode } from 'react';

/** Plinth's class with the project's own after it, as Blade's `$attributes->merge()` does. */
export const classNames = (base: string, extra: string | undefined): string =>
  extra?.trim() ? `${base} ${extra.trim()}` : base;

/**
 * Whether a node prints anything, as Vue's `hasContent` tells a filled slot from an empty one:
 * `null`, `undefined`, booleans and blank text print nothing, nor does a list or a fragment of
 * them (an empty `map()`, a false `&&`).
 */
export const hasContent = (node: ReactNode): boolean => {
  if (node === null || node === undefined || typeof node === 'boolean') return false;
  if (typeof node === 'string') return node.trim() !== '';
  if (Array.isArray(node)) return node.some(hasContent);
  if (isValidElement<{ children?: ReactNode }>(node) && node.type === Fragment) {
    return hasContent(node.props.children);
  }
  return true;
};
