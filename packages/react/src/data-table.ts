/** The sort states of a sortable column, as aria-sort takes them. `none` is the default. */
export const dataTableSorts = ['none', 'ascending', 'descending'] as const;
export type DataTableSort = (typeof dataTableSorts)[number];

/** A sort from the list, or `none` when it is not one of them. */
export function dataTableSort(value: string | undefined): DataTableSort {
  return dataTableSorts.includes(value as DataTableSort) ? (value as DataTableSort) : 'none';
}

/** What a cell is on a phone's card: a labelled field (the default), its title, or its actions. */
export const dataTableCellKinds = ['field', 'title', 'actions'] as const;
export type DataTableCellKind = (typeof dataTableCellKinds)[number];

/** A kind from the list, or `field` when it is not one of them. */
export function dataTableCellKind(value: string | undefined): DataTableCellKind {
  return dataTableCellKinds.includes(value as DataTableCellKind)
    ? (value as DataTableCellKind)
    : 'field';
}

/**
 * The sort button's icon: an arrow up and an arrow down; the column's aria-sort decides which
 * of them show. Blade's sort button prints the same markup.
 */
export const dataTableSortIcon =
  '<span class="plinth-icon plinth-data-table-sort-icon" data-size="sm" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="plinth-data-table-sort-up" d="M8 9l4-4 4 4"></path><path class="plinth-data-table-sort-down" d="M8 15l4 4 4-4"></path></svg></span>';
