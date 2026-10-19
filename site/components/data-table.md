# Data table

A collection of records (invoices, projects, people) from one markup: a stack of cards on a phone
and a table from 768px up. The CSS alone changes the layout, so there is no script, and every
layer prints the table once.

## When not to use it

- For a short list of settings or people with no columns to compare, use a
  [list card](list-card.md) of [list rows](list-row.md).
- In a Filament panel, which keeps its own tables.
- For a spreadsheet the person edits cell by cell: the data table shows records, it doesn't edit
  them.

## Cards on a phone, a table from 768px

Each row becomes a card on a phone: the **title** cell first, then each **field** as its label and
its value, then the **actions** under a divider. Pick the kind with `kind`; `field` is the default.
Narrow the window to see the cards.

```blade example layout="stack"
<x-plinth::data-table caption="Invoices">
    <x-slot:head>
        <x-plinth::data-table-column>Invoice</x-plinth::data-table-column>
        <x-plinth::data-table-column>Client</x-plinth::data-table-column>
        <x-plinth::data-table-column>Status</x-plinth::data-table-column>
        <x-plinth::data-table-column numeric>Total</x-plinth::data-table-column>
        <x-plinth::data-table-column>Actions</x-plinth::data-table-column>
    </x-slot:head>
    <x-plinth::data-table-row>
        <x-plinth::data-table-cell label="Invoice" kind="title">INV-1042</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Client">Atlas Studio</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Status"><x-plinth::badge tone="success">Paid</x-plinth::badge></x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Total" numeric>€1,240.00</x-plinth::data-table-cell>
        <x-plinth::data-table-cell kind="actions">
            <x-plinth::button variant="secondary" size="sm" href="#">View INV-1042</x-plinth::button>
        </x-plinth::data-table-cell>
    </x-plinth::data-table-row>
    <x-plinth::data-table-row>
        <x-plinth::data-table-cell label="Invoice" kind="title">INV-1041</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Client">Kestrel Labs</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Status"><x-plinth::badge tone="warning">Due soon</x-plinth::badge></x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Total" numeric>€380.00</x-plinth::data-table-cell>
        <x-plinth::data-table-cell kind="actions">
            <x-plinth::button variant="secondary" size="sm" href="#">View INV-1041</x-plinth::button>
        </x-plinth::data-table-cell>
    </x-plinth::data-table-row>
</x-plinth::data-table>
```

- **`kind="title"`** is the card's title, such as the invoice number, with no label. It must be the
  row's first cell, and the actions cell its last: the card moves them with `order`, which must
  not change the reading and focus order.
- **`kind="actions"`** holds the row's buttons, last on the card, with no label. From 768px up
  they sit at the start of their cell, under the column header.
- **`numeric`** aligns numbers to the end of a table cell, with figures of one width. Put it on
  the column header and its cells.
- **`hide-on-phone`** leaves a less important column out of the card and shows it from 768px up.
  Put it on the column header **and** on every cell of the column, so the headers still match the
  cells for a screen reader.
- A wide table from 768px up belongs in a scrolling container the app adds; text wraps in its
  cell.

## Sorting

The app owns sorting, paging and selection (ADR 2); the table only shows them. A sortable column
header takes `sort`: `none`, `ascending` or `descending`, with one column sorted at a time. Its
label is a data table sort button, which the app listens to; its icon shows both arrows, or the
one of the order. On a phone the sortable headers stay visible above the cards as a row of sort
buttons.

```blade example layout="stack"
<x-plinth::data-table caption="Projects">
    <x-slot:head>
        <x-plinth::data-table-column>Project</x-plinth::data-table-column>
        <x-plinth::data-table-column sort="descending">
            <x-plinth::data-table-sort>Updated</x-plinth::data-table-sort>
        </x-plinth::data-table-column>
        <x-plinth::data-table-column sort="none">
            <x-plinth::data-table-sort>Owner</x-plinth::data-table-sort>
        </x-plinth::data-table-column>
    </x-slot:head>
    <x-plinth::data-table-row>
        <x-plinth::data-table-cell label="Project" kind="title">Website redesign</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Updated">Today</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Owner">Ana Lima</x-plinth::data-table-cell>
    </x-plinth::data-table-row>
    <x-plinth::data-table-row>
        <x-plinth::data-table-cell label="Project" kind="title">Billing export</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Updated">Yesterday</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Owner">Rui Costa</x-plinth::data-table-cell>
    </x-plinth::data-table-row>
</x-plinth::data-table>
```

## Selection and the empty state

- **Selection:** a table whose rows can be selected puts `selected` on every row, true on the
  selected ones (it prints `aria-selected`). A selected row takes the selection tint and an accent
  edge at its start. `aria-selected` only drives the styling: screen readers don't announce it in
  a table. The control that selects a row (a checkbox, a pressed button) is the app's, and it
  carries the state.
- **The empty state:** one empty row in the body, whose cell spans every column (`columns`).
- **Paging** controls sit outside the table.

```blade example layout="stack"
<x-plinth::data-table caption="Team">
    <x-slot:head>
        <x-plinth::data-table-column>Name</x-plinth::data-table-column>
        <x-plinth::data-table-column>Role</x-plinth::data-table-column>
    </x-slot:head>
    <x-plinth::data-table-empty :columns="2">No one has joined yet.</x-plinth::data-table-empty>
</x-plinth::data-table>
```

## Markup contract

- **`plinth-data-table`**, the root, is the `<table>`; a project's classes and attributes land on
  it. The **caption** is optional: without one, name the table with `aria-label` or
  `aria-labelledby`.
- **The explicit roles** (`table`, `rowgroup`, `row`, `columnheader`, `cell`) are part of the
  contract. Some browsers, Safari in particular, drop a table's semantics once its rows stop
  displaying as table rows, which is what the phone's cards do.
- **`plinth-data-table-label`** repeats the column's name in each cell. It shows only on a phone's
  card and is `aria-hidden`, since the column header already names the cell.
- `data-kind`, `data-numeric`, `data-phone="hidden"` and `aria-sort` are the attributes the props
  print.

## Props

The same names in Blade and Vue; the React layer is coming in
[#66](https://github.com/bdynamicpt/plinth/issues/66).

| Component         | Prop        | Blade                                          | Vue                  | Default |
| ----------------- | ----------- | ---------------------------------------------- | -------------------- | ------- |
| data-table        | caption     | `caption="Invoices"`                           | `caption="Invoices"` | none    |
| data-table        | header row  | `<x-slot:head>`                                | `#head` slot         | none    |
| data-table        | rows        | the slot                                       | the default slot     | none    |
| data-table-column | sort        | `sort="ascending"` (or a `DataTableSort` case) | `sort="ascending"`   | none    |
| data-table-column | numeric     | `numeric`                                      | `numeric`            | off     |
| data-table-column | hideOnPhone | `hide-on-phone`                                | `hide-on-phone`      | off     |
| data-table-row    | selected    | `:selected="true"`                             | `:selected="true"`   | none    |
| data-table-cell   | label       | `label="Total"`                                | `label="Total"`      | none    |
| data-table-cell   | kind        | `kind="title"` (or a `DataTableCellKind` case) | `kind="title"`       | `field` |
| data-table-cell   | numeric     | `numeric`                                      | `numeric`            | off     |
| data-table-cell   | hideOnPhone | `hide-on-phone`                                | `hide-on-phone`      | off     |
| data-table-empty  | columns     | `:columns="4"`                                 | `:columns="4"`       | `1`     |
| data-table-sort   | label       | the slot                                       | the default slot     | none    |

An unknown sort falls back to `none` and an unknown kind to `field`. The app's attributes
(`wire:key`, `wire:click`, `@click`, `data-*`, `aria-*`) reach each part's root.

```blade tab="Blade"
<x-plinth::data-table caption="Invoices">
    <x-slot:head>
        <x-plinth::data-table-column>Invoice</x-plinth::data-table-column>
        <x-plinth::data-table-column :sort="$sort === 'date' ? $direction : 'none'">
            <x-plinth::data-table-sort wire:click="sortBy('date')">Date</x-plinth::data-table-sort>
        </x-plinth::data-table-column>
        <x-plinth::data-table-column numeric>Total</x-plinth::data-table-column>
    </x-slot:head>
    @forelse ($invoices as $invoice)
        <x-plinth::data-table-row wire:key="invoice-{{ $invoice->id }}">
            <x-plinth::data-table-cell label="Invoice" kind="title">{{ $invoice->number }}</x-plinth::data-table-cell>
            <x-plinth::data-table-cell label="Date">{{ $invoice->date }}</x-plinth::data-table-cell>
            <x-plinth::data-table-cell label="Total" numeric>{{ $invoice->total }}</x-plinth::data-table-cell>
        </x-plinth::data-table-row>
    @empty
        <x-plinth::data-table-empty :columns="3">No invoices yet.</x-plinth::data-table-empty>
    @endforelse
</x-plinth::data-table>
```

```vue tab="Vue"
<PlinthDataTable caption="Invoices">
  <template #head>
    <PlinthDataTableColumn>Invoice</PlinthDataTableColumn>
    <PlinthDataTableColumn :sort="sort === 'date' ? direction : 'none'">
      <PlinthDataTableSort @click="sortBy('date')">Date</PlinthDataTableSort>
    </PlinthDataTableColumn>
    <PlinthDataTableColumn numeric>Total</PlinthDataTableColumn>
  </template>
  <PlinthDataTableRow v-for="invoice in invoices" :key="invoice.id">
    <PlinthDataTableCell label="Invoice" kind="title">{{ invoice.number }}</PlinthDataTableCell>
    <PlinthDataTableCell label="Date">{{ invoice.date }}</PlinthDataTableCell>
    <PlinthDataTableCell label="Total" numeric>{{ invoice.total }}</PlinthDataTableCell>
  </PlinthDataTableRow>
  <PlinthDataTableEmpty v-if="invoices.length === 0" :columns="3">No invoices yet.</PlinthDataTableEmpty>
</PlinthDataTable>
```

## Accessibility

- A real `<table>` with explicit roles, so it stays a table for screen readers even when a phone
  shows its rows as cards. On a phone the header row stays in the accessibility tree, visually
  hidden, so every cell keeps its header.
- The label repeated in each card is `aria-hidden`: the column header already names the cell.
- A sorted column says so with `aria-sort`, and its sort button is a real `<button>`.
- A hidden-on-phone column is hidden on its header and every cell, so headers and cells still
  match.
- The minimum row height is `--plinth-data-table-row-height` (44px) in the table layout.
- Checked with axe in light and dark at 390, 768 and 1440px on every pull request.

The markup contract is at the top of
[`packages/css/src/components/data-table.css`](../../packages/css/src/components/data-table.css).
