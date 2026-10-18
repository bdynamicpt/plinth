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
