/** Helpers the components' markup functions share. */

/** Extra attributes a project puts on a component; they land on its root, and `class` is added. */
export type Attributes = Record<string, string>;

export const escape = (text: string) =>
  text.replace(/[&<>"']/g, (char) => `&#${char.charCodeAt(0)};`);

/**
 * The root's class list and the rest of the extra attributes, written out. Print `extra` straight
 * after the class, before Plinth's own attributes: an HTML parser keeps the first of two
 * attributes with the same name, so a project's attribute wins a clash, as in Blade, Vue and React
 * (docs/adr/0002).
 */
export function rootAttributes(
  base: string,
  attributes: Attributes,
): { classes: string; extra: string } {
  const { class: extraClass, ...rest } = attributes;
  return {
    classes: [base, extraClass].filter(Boolean).join(' '),
    extra: Object.entries(rest)
      .map(([name, value]) => ` ${name}="${escape(value)}"`)
      .join(''),
  };
}
