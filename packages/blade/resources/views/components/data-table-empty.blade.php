{{-- Markup contract: packages/css/src/components/data-table.css --}}
@props([
    'columns' => 1,
])
@php
    $span = max(1, (int) (is_numeric($columns) ? $columns : 1));
@endphp
<tr {{ $attributes->merge(['class' => 'plinth-data-table-empty', 'role' => 'row']) }}>
    <td class="plinth-data-table-empty-cell" role="cell" colspan="{{ $span }}">{{ $slot }}</td>
</tr>
