{{-- Markup contract: packages/css/src/components/data-table.css --}}
@props([
    'columns' => 1,
])
@php
    // A whole number of at least 1; anything that isn't a finite number is 1.
    $count = is_numeric($columns) ? (float) $columns : 1.0;
    $span = is_finite($count) ? max(1, (int) $count) : 1;
@endphp
<tr {{ $attributes->merge(['class' => 'plinth-data-table-empty', 'role' => 'row']) }}>
    <td class="plinth-data-table-empty-cell" role="cell" colspan="{{ $span }}">{{ $slot }}</td>
</tr>
