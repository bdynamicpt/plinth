import {
  dataTableCellKind,
  dataTableCellKinds,
  dataTableSort,
  dataTableSortIcon,
  dataTableSorts,
  type DataTableCellKind,
  type DataTableSort,
} from '@bdynamic/plinth-vue';
import { escape, rootAttributes, type Attributes } from './markup.ts';

export { dataTableCellKinds, dataTableSorts, type DataTableCellKind, type DataTableSort };

export interface DataTableColumnArgs {
  /** The column's name. */
  label: string;
  /** A sortable column's state; the label becomes a sort button. Leave it out for a fixed column. */
  sort?: DataTableSort;
  /** Numbers: aligned to the end, with figures of one width. */
  numeric: boolean;
  /** Hidden on a phone's card; shown from 768px up. */
  hideOnPhone: boolean;
}

export interface DataTableCellArgs {
  /** The cell's content, as markup (text, a badge, buttons). */
  content: string;
  /** The column's name, shown before the value on a phone's card. */
  label?: string;
  /** What the cell is on a phone's card. */
  kind: DataTableCellKind;
  numeric: boolean;
  hideOnPhone: boolean;
}

export interface DataTableRowArgs {
  /** A selectable row's state: true or false prints aria-selected; leave it out otherwise. */
  selected?: boolean;
  cells: DataTableCellArgs[];
}

export interface DataTableArgs {
  /** The table's name, shown above it. */
  caption?: string;
  columns: DataTableColumnArgs[];
  rows: DataTableRowArgs[];
  /** The text of the empty state, shown when there are no rows. */
  empty?: string;
}

/** The sort button, the label of a sortable column. */
export function dataTableSortButton(label: string, attributes: Attributes = {}): string {
  const { classes, extra } = rootAttributes('plinth-data-table-sort', attributes);
  return `<button type="button" class="${classes}"${extra}><span class="plinth-data-table-sort-label">${escape(label)}</span>${dataTableSortIcon}</button>`;
}

const flags = (numeric: boolean, hideOnPhone: boolean) =>
  (numeric ? ' data-numeric' : '') + (hideOnPhone ? ' data-phone="hidden"' : '');

/** A column header. Its content is the label, or the sort button for a sortable column. */
export function dataTableColumn(
  { sort, numeric, hideOnPhone }: Omit<DataTableColumnArgs, 'label'>,
  content: string,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-data-table-column', attributes);
  const ariaSort = sort === undefined ? '' : ` aria-sort="${dataTableSort(sort)}"`;
  return `<th class="${classes}" role="columnheader" scope="col"${ariaSort}${flags(numeric, hideOnPhone)}${extra}>${content}</th>`;
}

/** A column from its args: a sortable one holds the sort button. */
export const dataTableColumnFor = (column: DataTableColumnArgs) =>
  dataTableColumn(
    column,
    column.sort === undefined ? escape(column.label) : dataTableSortButton(column.label),
  );

export function dataTableCell(
  { content, label, kind, numeric, hideOnPhone }: DataTableCellArgs,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-data-table-cell', attributes);
  return [
    `<td class="${classes}" role="cell" data-kind="${dataTableCellKind(kind)}"${flags(numeric, hideOnPhone)}${extra}>`,
    label?.trim()
      ? `<span class="plinth-data-table-label" aria-hidden="true">${escape(label)}</span>`
      : '',
    `<span class="plinth-data-table-value">${content}</span>`,
    '</td>',
  ].join('');
}

/** A row; its content is its cells. */
export function dataTableRow(
  { selected }: Omit<DataTableRowArgs, 'cells'>,
  content: string,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-data-table-row', attributes);
  const ariaSelected = selected === undefined ? '' : ` aria-selected="${String(selected)}"`;
  return `<tr class="${classes}" role="row"${ariaSelected}${extra}>${content}</tr>`;
}

export const dataTableRowFor = (row: DataTableRowArgs) =>
  dataTableRow(row, row.cells.map((cell) => dataTableCell(cell)).join(''));

/** The empty state: one row with one cell across every column. */
export function dataTableEmpty(text: string, columns: number, attributes: Attributes = {}): string {
  const { classes, extra } = rootAttributes('plinth-data-table-empty', attributes);
  const span = Math.max(1, Math.trunc(columns) || 1);
  return `<tr class="${classes}" role="row"${extra}><td class="plinth-data-table-empty-cell" role="cell" colspan="${span}">${escape(text)}</td></tr>`;
}

/** The table, from the markup of its column headers and of its rows. */
export function dataTableShell(
  caption: string | undefined,
  head: string,
  body: string,
  attributes: Attributes = {},
): string {
  const { classes, extra } = rootAttributes('plinth-data-table', attributes);
  return [
    `<table class="${classes}" role="table"${extra}>`,
    caption?.trim()
      ? `<caption class="plinth-data-table-caption">${escape(caption)}</caption>`
      : '',
    `<thead class="plinth-data-table-head" role="rowgroup"><tr class="plinth-data-table-head-row" role="row">${head}</tr></thead>`,
    `<tbody class="plinth-data-table-body" role="rowgroup">${body}</tbody>`,
    '</table>',
  ].join('');
}

/** The head slot: every column header. */
export const dataTableHead = (columns: DataTableColumnArgs[]) =>
  columns.map(dataTableColumnFor).join('');

/** The body slot: the rows, or the empty state when there are none. */
export const dataTableBody = ({ columns, rows, empty }: DataTableArgs) =>
  rows.length > 0 || empty === undefined
    ? rows.map(dataTableRowFor).join('')
    : dataTableEmpty(empty, columns.length);

/** The data table's markup contract. Blade and Vue must print exactly this (see parity.test.ts). */
export function dataTable(args: DataTableArgs, attributes: Attributes = {}): string {
  return dataTableShell(args.caption, dataTableHead(args.columns), dataTableBody(args), attributes);
}
