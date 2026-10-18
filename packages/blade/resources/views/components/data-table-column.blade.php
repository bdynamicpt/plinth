{{-- Markup contract: packages/css/src/components/data-table.css --}}
@props([
    'sort' => null,
    'numeric' => false,
    'hideOnPhone' => false,
])
@php
    $root = array_filter([
        'class' => 'plinth-data-table-column',
        'role' => 'columnheader',
        'scope' => 'col',
        'aria-sort' => filled($sort) ? \BDynamic\Plinth\Enums\DataTableSort::resolve($sort)->value : null,
        'data-numeric' => $numeric ? '' : null,
        'data-phone' => $hideOnPhone ? 'hidden' : null,
    ], fn ($value) => $value !== null);
@endphp
<th {{ $attributes->merge($root) }}>{{ $slot }}</th>
