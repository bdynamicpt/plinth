// Markup contract: packages/css/src/components/data-table.css
import type { ComponentProps } from 'react';
import { classNames } from './markup';

interface DataTableRowOptions {
  /** A selectable row's state, printed as aria-selected; leave it out when rows can't be selected. */
  selected?: boolean;
}

/** A row of PlinthDataTableCell elements. */
export type PlinthDataTableRowProps = DataTableRowOptions &
  Omit<ComponentProps<'tr'>, keyof DataTableRowOptions>;

export function PlinthDataTableRow({
  selected,
  className,
  children,
  ...rest
}: PlinthDataTableRowProps) {
  return (
    <tr
      role="row"
      aria-selected={selected === undefined ? undefined : selected ? 'true' : 'false'}
      {...rest}
      className={classNames('plinth-data-table-row', className)}
    >
      {children}
    </tr>
  );
}
