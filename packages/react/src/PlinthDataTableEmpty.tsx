// Markup contract: packages/css/src/components/data-table.css
import type { ComponentProps } from 'react';
import { classNames } from './markup';

interface DataTableEmptyOptions {
  /** How many columns the table has; the empty cell spans them all. */
  columns?: number | string;
}

/** The row in place of the rows when there are none: `children` say so. */
export type PlinthDataTableEmptyProps = DataTableEmptyOptions &
  Omit<ComponentProps<'tr'>, keyof DataTableEmptyOptions>;

// A whole number of at least 1; anything that isn't a decimal number is 1, as Blade's view decides.
const decimal = /^\s*[+-]?(\d+\.?\d*|\.\d+)([eE][+-]?\d+)?\s*$/;
const span = (columns: number | string): number => {
  const count = typeof columns === 'number' || decimal.test(columns) ? Number(columns) : Number.NaN;
  return Number.isFinite(count) ? Math.max(1, Math.trunc(count)) : 1;
};

export function PlinthDataTableEmpty({
  columns = 1,
  className,
  children,
  ...rest
}: PlinthDataTableEmptyProps) {
  return (
    <tr role="row" {...rest} className={classNames('plinth-data-table-empty', className)}>
      <td className="plinth-data-table-empty-cell" role="cell" colSpan={span(columns)}>
        {children}
      </td>
    </tr>
  );
}
