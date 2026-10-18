{{-- Markup contract: packages/css/src/components/data-table.css --}}
@props([
    'caption' => null,
])
<table {{ $attributes->merge(['class' => 'plinth-data-table', 'role' => 'table']) }}>
    @if (filled($caption))
        <caption class="plinth-data-table-caption">{{ $caption }}</caption>
    @endif
    <thead class="plinth-data-table-head" role="rowgroup">
        <tr class="plinth-data-table-head-row" role="row">{{ $head ?? '' }}</tr>
    </thead>
    <tbody class="plinth-data-table-body" role="rowgroup">{{ $slot }}</tbody>
</table>
