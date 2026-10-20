import { fireEvent, render } from '@testing-library/react';
import { createRef, type ReactElement, type ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import {
  dataTableCellKinds,
  dataTableSortIcon,
  dataTableSorts,
  PlinthDataTable,
  PlinthDataTableCell,
  PlinthDataTableColumn,
  PlinthDataTableEmpty,
  PlinthDataTableRow,
  PlinthDataTableSort,
  type DataTableCellKind,
  type DataTableSort,
} from '../src/index.ts';

const root = (element: ReactElement) => render(element).container.firstElementChild!;
/** A table part, rendered where the browser keeps it. */
const inRow = (element: ReactNode) =>
  render(
    <table>
      <tbody>
        <tr>{element}</tr>
      </tbody>
    </table>,
  ).container.querySelector('tr')!.firstElementChild!;
const inBody = (element: ReactNode) =>
  render(
    <table>
      <tbody>{element}</tbody>
    </table>,
  ).container.querySelector('tbody')!.firstElementChild!;

describe('PlinthDataTable', () => {
  it('prints the caption, the head row and the body', () => {
    expect(
      renderToStaticMarkup(
        <PlinthDataTable
          caption="Invoices"
          head={<PlinthDataTableColumn>Invoice</PlinthDataTableColumn>}
        >
          <PlinthDataTableRow>
            <PlinthDataTableCell label="Invoice" kind="title">
              INV-1042
            </PlinthDataTableCell>
          </PlinthDataTableRow>
        </PlinthDataTable>,
      ),
    ).toBe(
      '<table role="table" class="plinth-data-table"><caption class="plinth-data-table-caption">Invoices</caption>' +
        '<thead class="plinth-data-table-head" role="rowgroup"><tr class="plinth-data-table-head-row" role="row">' +
        '<th role="columnheader" scope="col" class="plinth-data-table-column">Invoice</th></tr></thead>' +
        '<tbody class="plinth-data-table-body" role="rowgroup"><tr role="row" class="plinth-data-table-row">' +
        '<td role="cell" data-kind="title" class="plinth-data-table-cell"><span class="plinth-data-table-label" aria-hidden="true">Invoice</span>' +
        '<span class="plinth-data-table-value">INV-1042</span></td></tr></tbody></table>',
    );
  });

  it('leaves out a blank caption', () => {
    expect(root(<PlinthDataTable caption=" " />).querySelector('caption')).toBeNull();
  });

  it('passes other props and the ref to the table, and lets a project attribute win', () => {
    const ref = createRef<HTMLTableElement>();
    const table = root(
      <PlinthDataTable ref={ref} className="mt-4" role="grid" aria-label="Orders" />,
    );

    expect(table.className).toBe('plinth-data-table mt-4');
    expect(table.getAttribute('role')).toBe('grid');
    expect(table.getAttribute('aria-label')).toBe('Orders');
    expect(ref.current).toBe(table);
  });
});

describe('PlinthDataTableColumn', () => {
  it.each(dataTableSorts)('prints the %s sort as aria-sort', (sort) => {
    expect(
      inRow(<PlinthDataTableColumn sort={sort}>Date</PlinthDataTableColumn>).getAttribute(
        'aria-sort',
      ),
    ).toBe(sort);
  });

  it('leaves out a blank sort, and falls back to none for one it does not know', () => {
    const sort = (value: string) =>
      inRow(
        <PlinthDataTableColumn sort={value as DataTableSort}>Date</PlinthDataTableColumn>,
      ).getAttribute('aria-sort');

    expect(sort(' ')).toBeNull();
    expect(sort('sideways')).toBe('none');
  });

  it('takes numeric and hideOnPhone, and passes other props, letting a project attribute win', () => {
    const ref = createRef<HTMLTableCellElement>();
    const column = inRow(
      <PlinthDataTableColumn ref={ref} numeric hideOnPhone className="w-32" scope="colgroup">
        Total
      </PlinthDataTableColumn>,
    );

    expect(column.getAttribute('data-numeric')).toBe('');
    expect(column.getAttribute('data-phone')).toBe('hidden');
    expect(column.className).toBe('plinth-data-table-column w-32');
    expect(column.getAttribute('scope')).toBe('colgroup');
    expect(ref.current).toBe(column);
  });
});

describe('PlinthDataTableSort', () => {
  it('prints the sort button with its icon, and takes a click', () => {
    const onClick = vi.fn();
    const button = root(
      <PlinthDataTableSort className="is-busy" onClick={onClick}>
        Date
      </PlinthDataTableSort>,
    );
    fireEvent.click(button);

    expect(button.outerHTML).toBe(
      '<button type="button" class="plinth-data-table-sort is-busy"><span class="plinth-data-table-sort-label">Date</span>' +
        `${dataTableSortIcon}</button>`,
    );
    expect(onClick).toHaveBeenCalledOnce();
    expect(
      root(<PlinthDataTableSort type="submit">Date</PlinthDataTableSort>).getAttribute('type'),
    ).toBe('submit');
  });
});

describe('PlinthDataTableRow', () => {
  it('prints aria-selected only for a selectable row, and lets a project attribute win', () => {
    const selected = (value: boolean | undefined) =>
      inBody(<PlinthDataTableRow selected={value} />).getAttribute('aria-selected');

    expect([undefined, true, false].map(selected)).toEqual([null, 'true', 'false']);
    expect(
      inBody(<PlinthDataTableRow selected aria-selected="false" className="is-new" />).outerHTML,
    ).toBe('<tr role="row" aria-selected="false" class="plinth-data-table-row is-new"></tr>');
  });
});

describe('PlinthDataTableCell', () => {
  it.each(dataTableCellKinds)('takes the %s kind', (kind) => {
    expect(
      inRow(<PlinthDataTableCell kind={kind}>x</PlinthDataTableCell>).getAttribute('data-kind'),
    ).toBe(kind);
  });

  it('falls back to field, leaves out a blank label, and takes numeric and hideOnPhone', () => {
    const cell = inRow(
      <PlinthDataTableCell kind={'header' as DataTableCellKind} label=" " numeric hideOnPhone>
        €86.50
      </PlinthDataTableCell>,
    );

    expect(cell.getAttribute('data-kind')).toBe('field');
    expect(cell.querySelector('.plinth-data-table-label')).toBeNull();
    expect(cell.getAttribute('data-numeric')).toBe('');
    expect(cell.getAttribute('data-phone')).toBe('hidden');
  });

  it('passes other props, letting a project attribute win', () => {
    const cell = inRow(
      <PlinthDataTableCell className="truncate" role="gridcell">
        x
      </PlinthDataTableCell>,
    );

    expect(cell.className).toBe('plinth-data-table-cell truncate');
    expect(cell.getAttribute('role')).toBe('gridcell');
  });
});

describe('PlinthDataTableEmpty', () => {
  it('spans the columns, a whole number of at least one', () => {
    const span = (columns?: number | string) =>
      inBody(<PlinthDataTableEmpty columns={columns}>No orders yet.</PlinthDataTableEmpty>)
        .querySelector('td')!
        .getAttribute('colspan');

    expect([undefined, 5, '3', ' 2.7 ', 0, -2, 'many', '', Number.NaN].map(span)).toEqual([
      '1',
      '5',
      '3',
      '2',
      '1',
      '1',
      '1',
      '1',
      '1',
    ]);
  });

  it('passes other props, letting a project attribute win', () => {
    expect(
      inBody(
        <PlinthDataTableEmpty className="is-filtered" role="presentation">
          No orders yet.
        </PlinthDataTableEmpty>,
      ).outerHTML,
    ).toBe(
      '<tr role="presentation" class="plinth-data-table-empty is-filtered"><td class="plinth-data-table-empty-cell" role="cell" colspan="1">No orders yet.</td></tr>',
    );
  });
});
