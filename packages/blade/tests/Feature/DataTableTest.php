<?php

use BDynamic\Plinth\Enums\DataTableCellKind;
use BDynamic\Plinth\Enums\DataTableSort;
use Illuminate\Support\Facades\Blade;

$icon = '<span class="plinth-icon plinth-data-table-sort-icon" data-size="sm" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path class="plinth-data-table-sort-up" d="M8 9l4-4 4 4"></path><path class="plinth-data-table-sort-down" d="M8 15l4 4 4-4"></path></svg></span>';

it('prints the table with its caption, head and body', function () {
    $html = Blade::render(<<<'BLADE'
        <x-plinth::data-table caption="Orders">
            <x-slot:head><x-plinth::data-table-column>Order</x-plinth::data-table-column></x-slot:head>
            <x-plinth::data-table-row><x-plinth::data-table-cell label="Order" kind="title">#1042</x-plinth::data-table-cell></x-plinth::data-table-row>
        </x-plinth::data-table>
        BLADE);

    expect(squish($html))->toBe(
        '<table class="plinth-data-table" role="table"><caption class="plinth-data-table-caption">Orders</caption>'
        .'<thead class="plinth-data-table-head" role="rowgroup"><tr class="plinth-data-table-head-row" role="row">'
        .'<th class="plinth-data-table-column" role="columnheader" scope="col">Order</th></tr></thead>'
        .'<tbody class="plinth-data-table-body" role="rowgroup"><tr class="plinth-data-table-row" role="row">'
        .'<td class="plinth-data-table-cell" role="cell" data-kind="title"><span class="plinth-data-table-label" aria-hidden="true">Order</span>'
        .'<span class="plinth-data-table-value">#1042</span></td></tr></tbody></table>'
    );
});

it('leaves out an empty caption, and prints an empty head without the slot', function () {
    foreach (['', ' ', null] as $caption) {
        expect(squish(Blade::render('<x-plinth::data-table :caption="$caption"></x-plinth::data-table>', ['caption' => $caption])))
            ->toBe('<table class="plinth-data-table" role="table"><thead class="plinth-data-table-head" role="rowgroup">'
                .'<tr class="plinth-data-table-head-row" role="row"></tr></thead>'
                .'<tbody class="plinth-data-table-body" role="rowgroup"></tbody></table>');
    }
});

it('escapes the caption, the column, the label and the empty text', function () {
    $html = Blade::render(
        '<x-plinth::data-table :caption="$x"></x-plinth::data-table>'
        .'<x-plinth::data-table-column>{{ $x }}</x-plinth::data-table-column>'
        .'<x-plinth::data-table-sort>{{ $x }}</x-plinth::data-table-sort>'
        .'<x-plinth::data-table-cell :label="$x">{{ $x }}</x-plinth::data-table-cell>'
        .'<x-plinth::data-table-empty>{{ $x }}</x-plinth::data-table-empty>',
        ['x' => '<b>x</b>'],
    );

    expect($html)->not->toContain('<b>')->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('prints a column header, and marks a numeric one and one hidden on a phone', function () {
    expect(squish(Blade::render('<x-plinth::data-table-column>Order</x-plinth::data-table-column>')))
        ->toBe('<th class="plinth-data-table-column" role="columnheader" scope="col">Order</th>');
    expect(squish(Blade::render('<x-plinth::data-table-column numeric hide-on-phone>Total</x-plinth::data-table-column>')))
        ->toBe('<th class="plinth-data-table-column" role="columnheader" scope="col" data-numeric="" data-phone="hidden">Total</th>');
});

it('prints aria-sort on a sortable column, and falls back to none', function () {
    $sort = fn (mixed $value) => Blade::render('<x-plinth::data-table-column :sort="$sort">Date</x-plinth::data-table-column>', ['sort' => $value]);

    expect($sort('ascending'))->toContain('aria-sort="ascending"')
        ->and($sort(DataTableSort::Descending))->toContain('aria-sort="descending"')
        ->and($sort('none'))->toContain('aria-sort="none"')
        ->and($sort('sideways'))->toContain('aria-sort="none"');
    foreach (['', ' ', null] as $value) {
        expect($sort($value))->not->toContain('aria-sort');
    }
});

it('prints the sort button with its icon', function () use ($icon) {
    expect(squish(Blade::render('<x-plinth::data-table-sort>Date</x-plinth::data-table-sort>')))
        ->toBe('<button type="button" class="plinth-data-table-sort"><span class="plinth-data-table-sort-label">Date</span>'.$icon.'</button>');
});

it('prints a row, and aria-selected only on a row that can be selected', function () {
    expect(squish(Blade::render('<x-plinth::data-table-row><td></td></x-plinth::data-table-row>')))
        ->toBe('<tr class="plinth-data-table-row" role="row"><td></td></tr>');
    expect(Blade::render('<x-plinth::data-table-row :selected="true"></x-plinth::data-table-row>'))
        ->toContain('aria-selected="true"');
    expect(Blade::render('<x-plinth::data-table-row :selected="false"></x-plinth::data-table-row>'))
        ->toContain('aria-selected="false"');
});

it('prints a cell, a field by default and without a blank label', function () {
    expect(squish(Blade::render('<x-plinth::data-table-cell>3 Oct</x-plinth::data-table-cell>')))
        ->toBe('<td class="plinth-data-table-cell" role="cell" data-kind="field"><span class="plinth-data-table-value">3 Oct</span></td>');
    expect(Blade::render('<x-plinth::data-table-cell label=" ">3 Oct</x-plinth::data-table-cell>'))
        ->not->toContain('plinth-data-table-label');
});

it('takes a cell kind, and falls back to field', function () {
    $kind = fn (mixed $value) => Blade::render('<x-plinth::data-table-cell :kind="$kind">x</x-plinth::data-table-cell>', ['kind' => $value]);

    expect($kind('title'))->toContain('data-kind="title"')
        ->and($kind(DataTableCellKind::Actions))->toContain('data-kind="actions"')
        ->and($kind('header'))->toContain('data-kind="field"')
        ->and($kind(null))->toContain('data-kind="field"');
});

it('marks a numeric cell and one hidden on a phone', function () {
    expect(Blade::render('<x-plinth::data-table-cell numeric hide-on-phone>€1</x-plinth::data-table-cell>'))
        ->toContain('data-numeric=""')
        ->toContain('data-phone="hidden"');
});

it('prints the empty state across the columns, at least one', function () {
    expect(squish(Blade::render('<x-plinth::data-table-empty :columns="5">No orders yet.</x-plinth::data-table-empty>')))
        ->toBe('<tr class="plinth-data-table-empty" role="row"><td class="plinth-data-table-empty-cell" role="cell" colspan="5">No orders yet.</td></tr>');
    foreach ([[null, '1'], ['3', '3'], [2.7, '2'], [0, '1'], [-2, '1'], ['many', '1'], [INF, '1'], ['0x1A', '1'], [' 1e1 ', '10']] as [$columns, $span]) {
        expect(Blade::render('<x-plinth::data-table-empty :columns="$columns">None</x-plinth::data-table-empty>', ['columns' => $columns]))
            ->toContain('colspan="'.$span.'"');
    }
});

it('passes extra attributes to every root', function () {
    $html = Blade::render(
        '<x-plinth::data-table class="mt-4" id="orders" aria-label="Orders"></x-plinth::data-table>'
        .'<x-plinth::data-table-column class="w-32" data-key="date">Date</x-plinth::data-table-column>'
        .'<x-plinth::data-table-sort wire:click="sortBy">Date</x-plinth::data-table-sort>'
        .'<x-plinth::data-table-row wire:key="order-1042" x-on:click="open = true"></x-plinth::data-table-row>'
        .'<x-plinth::data-table-cell class="truncate" data-test="cell">x</x-plinth::data-table-cell>'
        .'<x-plinth::data-table-empty class="text-sm" id="empty">None</x-plinth::data-table-empty>',
    );

    expect($html)
        ->toContain('class="plinth-data-table mt-4"')
        ->toContain('id="orders"')
        ->toContain('aria-label="Orders"')
        ->toContain('class="plinth-data-table-column w-32"')
        ->toContain('data-key="date"')
        ->toContain('wire:click="sortBy"')
        ->toContain('wire:key="order-1042"')
        ->toContain('x-on:click="open = true"')
        ->toContain('class="plinth-data-table-cell truncate"')
        ->toContain('data-test="cell"')
        ->toContain('class="plinth-data-table-empty text-sm"')
        ->toContain('id="empty"');
});
