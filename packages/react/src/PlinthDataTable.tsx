// Markup contract: packages/css/src/components/data-table.css
import type { ComponentProps, ReactNode } from 'react';
import { classNames } from './markup';

interface DataTableOptions {
  /** The table's name, shown above it. Without it, name the table with aria-label. */
  caption?: string;
  /** The column headers, PlinthDataTableColumn elements (Vue's `head` slot). */
  head?: ReactNode;
}

/** A table that becomes a card per row on a phone: `children` are its rows. */
export type PlinthDataTableProps = DataTableOptions &
  Omit<ComponentProps<'table'>, keyof DataTableOptions>;

export function PlinthDataTable({
  caption,
  head,
  className,
  children,
  ...rest
}: PlinthDataTableProps) {
  return (
    <table role="table" {...rest} className={classNames('plinth-data-table', className)}>
      {caption?.trim() ? <caption className="plinth-data-table-caption">{caption}</caption> : null}
      <thead className="plinth-data-table-head" role="rowgroup">
        <tr className="plinth-data-table-head-row" role="row">
          {head}
        </tr>
      </thead>
      <tbody className="plinth-data-table-body" role="rowgroup">
        {children}
      </tbody>
    </table>
  );
}
