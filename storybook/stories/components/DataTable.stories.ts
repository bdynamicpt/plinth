import type { Meta, StoryObj } from '@storybook/html-vite';
import { badge } from './badge.ts';
import { button } from './button.ts';
import {
  dataTable,
  type DataTableArgs,
  type DataTableCellArgs,
  type DataTableColumnArgs,
  type DataTableRowArgs,
} from './data-table.ts';
import '@bdynamic/plinth-css/src/components/icon.css';
import '@bdynamic/plinth-css/src/components/badge.css';
import '@bdynamic/plinth-css/src/components/button.css';
import '@bdynamic/plinth-css/src/components/data-table.css';

const column = (label: string, extra: Partial<DataTableColumnArgs> = {}): DataTableColumnArgs => ({
  label,
  numeric: false,
  hideOnPhone: false,
  ...extra,
});

const cell = (
  label: string | undefined,
  content: string,
  extra: Partial<DataTableCellArgs> = {},
): DataTableCellArgs => ({
  label,
  content,
  kind: 'field',
  numeric: false,
  hideOnPhone: false,
  ...extra,
});

const view = (order: string) =>
  button({
    label: `View ${order}`,
    variant: 'secondary',
    size: 'sm',
    disabled: false,
    busy: false,
  });

interface Order {
  number: string;
  customer: string;
  email: string;
  date: string;
  status: string;
  tone: 'neutral' | 'success' | 'warning' | 'danger';
  total: string;
}

const orders: Order[] = [
  {
    number: '#1042',
    customer: 'Ana Lima',
    email: 'ana@example.com',
    date: '3 Oct 2026',
    status: 'Paid',
    tone: 'success',
    total: '€1,240.00',
  },
  {
    number: '#1041',
    customer: 'Sam Lee',
    email: 'sam@example.com',
    date: '2 Oct 2026',
    status: 'Pending',
    tone: 'warning',
    total: '€86.50',
  },
  {
    number: '#1040',
    customer: 'Rui Costa',
    email: 'rui@example.com',
    date: '30 Sep 2026',
    status: 'Refunded',
    tone: 'neutral',
    total: '€312.00',
  },
];

const columns = [
  column('Order'),
  column('Customer'),
  column('Date'),
  column('Status'),
  column('Total', { numeric: true }),
  column('Actions'),
];

const orderRow = (order: Order, extra: Partial<DataTableRowArgs> = {}): DataTableRowArgs => ({
  cells: [
    cell('Order', order.number, { kind: 'title' }),
    cell('Customer', order.customer),
    cell('Date', order.date),
    cell('Status', badge({ label: order.status, tone: order.tone, dot: true })),
    cell('Total', order.total, { numeric: true }),
    cell(undefined, view(order.number), { kind: 'actions' }),
  ],
  ...extra,
});

const meta = {
  title: 'Components/Data Table',
  // The docs page is DataTable.mdx, written by hand.
  tags: ['!autodocs'],
  render: (args) => dataTable(args),
  args: { caption: 'Orders', columns, rows: orders.map((order) => orderRow(order)) },
  argTypes: {
    caption: { control: 'text' },
    empty: { control: 'text' },
  },
} satisfies Meta<DataTableArgs>;

export default meta;
type Story = StoryObj<DataTableArgs>;

export const Default: Story = {};

/** Sortable columns: the dates newest first, the order number and the total not sorted. */
export const Sorted: Story = {
  args: {
    columns: [
      column('Order', { sort: 'none' }),
      column('Customer'),
      column('Date', { sort: 'descending' }),
      column('Status'),
      column('Total', { numeric: true, sort: 'none' }),
      column('Actions'),
    ],
  },
};

export const SortedAscending: Story = {
  args: {
    columns: [
      column('Order', { sort: 'none' }),
      column('Customer'),
      column('Date'),
      column('Status'),
      column('Total', { numeric: true, sort: 'ascending' }),
      column('Actions'),
    ],
  },
};

/** Rows that can be selected: aria-selected on every row, true on the selected one. */
export const Selected: Story = {
  args: {
    rows: orders.map((order, index) => orderRow(order, { selected: index === 1 })),
  },
};

/** The email is a less important column: on a phone the card leaves it out. */
export const HiddenOnPhone: Story = {
  args: {
    columns: [...columns.slice(0, 2), column('Email', { hideOnPhone: true }), ...columns.slice(2)],
    rows: orders.map((order) => {
      const row = orderRow(order);
      row.cells.splice(2, 0, cell('Email', order.email, { hideOnPhone: true }));
      return row;
    }),
  },
};

export const Empty: Story = { args: { rows: [], empty: 'No orders yet.' } };

export const WithoutCaption: Story = {
  args: { caption: undefined },
  render: (args) => dataTable(args, { 'aria-label': 'Orders' }),
};

export const LongText: Story = {
  args: {
    caption: 'Orders placed this month by every customer in the workspace, newest first',
    rows: [
      orderRow({
        ...orders[0]!,
        customer: 'A customer name long enough to wrap onto a second line on a narrow screen',
        status: 'Waiting for the bank transfer',
      }),
    ],
  },
};

/** The same table in right-to-left text: the labels and values swap sides. */
export const RightToLeft: Story = {
  render: () => `<div dir="rtl">${dataTable({ ...meta.args, ...Sorted.args })}</div>`,
};
