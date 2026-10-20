// Markup contract: packages/css/src/components/data-table.css
import type { ComponentProps } from 'react';
import { dataTableSort, type DataTableSort } from './data-table';
import { classNames } from './markup';

interface DataTableColumnOptions {
  /** A sortable column's state, printed as aria-sort; put a PlinthDataTableSort in it. */
  sort?: DataTableSort;
  /** Numbers: aligned to the end, with figures of one width. */
  numeric?: boolean;
  /** Hidden on a phone's card; shown from 768px up. Give the column's cells the same. */
  hideOnPhone?: boolean;
}

export type PlinthDataTableColumnProps = DataTableColumnOptions &
  Omit<ComponentProps<'th'>, keyof DataTableColumnOptions>;

export function PlinthDataTableColumn({
  sort,
  numeric = false,
  hideOnPhone = false,
  className,
  children,
  ...rest
}: PlinthDataTableColumnProps) {
  return (
    <th
      role="columnheader"
      scope="col"
      // A blank sort counts as missing, as Blade's filled() decides.
      aria-sort={sort?.trim() ? dataTableSort(sort) : undefined}
      data-numeric={numeric ? '' : undefined}
      data-phone={hideOnPhone ? 'hidden' : undefined}
      {...rest}
      className={classNames('plinth-data-table-column', className)}
    >
      {children}
    </th>
  );
}
