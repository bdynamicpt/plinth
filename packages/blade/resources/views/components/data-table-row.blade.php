{{-- Markup contract: packages/css/src/components/data-table.css --}}
@props([
    'selected' => null,
])
@php
    $root = array_filter([
        'class' => 'plinth-data-table-row',
        'role' => 'row',
        'aria-selected' => $selected === null ? null : ($selected ? 'true' : 'false'),
    ], fn ($value) => $value !== null);
@endphp
<tr {{ $attributes->merge($root) }}>{{ $slot }}</tr>
