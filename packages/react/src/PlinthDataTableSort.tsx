// Markup contract: packages/css/src/components/data-table.css
import type { ComponentProps } from 'react';
import { classNames } from './markup';

/** The sort button in a sortable column's header; the column's `sort` says its state. */
export type PlinthDataTableSortProps = ComponentProps<'button'>;

export function PlinthDataTableSort({ className, children, ...rest }: PlinthDataTableSortProps) {
  return (
    <button type="button" {...rest} className={classNames('plinth-data-table-sort', className)}>
      <span className="plinth-data-table-sort-label">{children}</span>
      {/* The icon is dataTableSortIcon (data-table.ts), written out; parity keeps the copies equal. */}
      <span className="plinth-icon plinth-data-table-sort-icon" data-size="sm" aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path className="plinth-data-table-sort-up" d="M8 9l4-4 4 4"></path>
          <path className="plinth-data-table-sort-down" d="M8 15l4 4 4-4"></path>
        </svg>
      </span>
    </button>
  );
}
