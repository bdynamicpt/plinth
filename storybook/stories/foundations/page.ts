import { tokens, type Token } from '@bdynamic/plinth-tokens';
import './foundations.css';

/** A section with a heading, an optional lead paragraph and some HTML. */
export function section(title: string, lead: string, body: string): string {
  return `<section><h2>${title}</h2>${lead ? `<p>${lead}</p>` : ''}${body}</section>`;
}

/** A table with a header row; cells are HTML. */
export function table(head: string[], rows: string[][]): string {
  return `<div class="sb-scroll"><table class="sb-table"><thead><tr>${head
    .map((cell) => `<th scope="col">${cell}</th>`)
    .join('')}</tr></thead><tbody>${rows
    .map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`)
    .join('')}</tbody></table></div>`;
}

export const code = (text: string) => `<code>${text}</code>`;

export const page = (...sections: string[]) => `<div class="sb-page">${sections.join('')}</div>`;

/** Foundations pages are one story each, shown on their own (no docs page). */
export const pageParameters = { layout: 'padded', controls: { disable: true } };

/** Tokens of a tier whose path starts with the given segments. */
export function group(tier: Token['tier'], ...path: string[]): Token[] {
  return tokens.filter((t) => t.tier === tier && path.every((segment, i) => t.path[i] === segment));
}

/** A preview of a token, drawn with its var(), so it follows the theme and the brand. */
export function preview(token: Token): string {
  const v = token.cssVar;
  const [first] = token.path[0] === 'ref' ? token.path.slice(1) : token.path;
  switch (token.type) {
    case 'color':
      return `<div class="sb-chip sb-chip-small" style="background-color: ${v}"></div>`;
    case 'shadow':
      return `<div class="sb-shadow" style="box-shadow: ${v}"></div>`;
    case 'fontFamily':
      return `<span style="font-family: ${v}">The quick brown fox</span>`;
    case 'fontWeight':
      return `<span style="font-weight: ${v}">Plinth</span>`;
    case 'dimension':
      if (first === 'radius') return `<div class="sb-radius" style="border-radius: ${v}"></div>`;
      if (first === 'font') return `<span style="font-size: ${v}; line-height: 1.2">Plinth</span>`;
      if (first === 'breakpoint') return '';
      return `<div class="sb-bar" style="inline-size: ${v}"></div>`;
    default:
      return '';
  }
}

/** Table of tokens: name, preview, value (light and dark when they differ) and what it uses. */
export function tokenTable(list: Token[]): string {
  const themed = list.some((t) => t.dark !== undefined);
  const head = ['Token', 'Preview', themed ? 'Light' : 'Value', ...(themed ? ['Dark'] : [])];
  return table(
    head,
    list.map((t) => [
      code(t.name),
      preview(t),
      `${t.value}${t.ref ? `<br>${code(t.ref)}` : ''}`,
      ...(themed ? [`${t.dark ?? ''}${t.darkRef ? `<br>${code(t.darkRef)}` : ''}`] : []),
    ]),
  );
}
