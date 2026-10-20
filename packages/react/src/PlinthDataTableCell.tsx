// Markup contract: packages/css/src/components/data-table.css
import type { ComponentProps } from 'react';
import { dataTableCellKind, type DataTableCellKind } from './data-table';
import { classNames } from './markup';

interface DataTableCellOptions {
  /** The column's name, shown before the value on a phone's card. */
  label?: string;
  /** What the cell is on a phone's card: a labelled field, the card's title, or its actions. */
  kind?: DataTableCellKind;
  /** Numbers: aligned to the end, with figures of one width. */
  numeric?: boolean;
  /** Hidden on a phone's card; shown from 768px up. */
  hideOnPhone?: boolean;
}

export type PlinthDataTableCellProps = DataTableCellOptions &
  Omit<ComponentProps<'td'>, keyof DataTableCellOptions>;

export function PlinthDataTableCell({
  label,
  kind,
  numeric = false,
  hideOnPhone = false,
  className,
  children,
  ...rest
}: PlinthDataTableCellProps) {
  return (
    <td
      role="cell"
      data-kind={dataTableCellKind(kind)}
      data-numeric={numeric ? '' : undefined}
      data-phone={hideOnPhone ? 'hidden' : undefined}
      {...rest}
      className={classNames('plinth-data-table-cell', className)}
    >
      {label?.trim() ? (
        <span className="plinth-data-table-label" aria-hidden="true">
          {label}
        </span>
      ) : null}
      <span className="plinth-data-table-value">{children}</span>
    </td>
  );
}
