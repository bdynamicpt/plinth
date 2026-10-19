{{-- A Markdown table as Plinth's data table; the first column is each card's title on a phone. --}}
<x-plinth::data-table class="site-docs-table">
    <x-slot:head>
        @foreach ($head as $cell)
            <x-plinth::data-table-column>{{ $cell }}</x-plinth::data-table-column>
        @endforeach
    </x-slot:head>
    @foreach ($rows as $row)
        <x-plinth::data-table-row>
            @foreach ($row as $cell)
                <x-plinth::data-table-cell :kind="$loop->first ? 'title' : 'field'" :label="$loop->first ? null : ($labels[$loop->index] ?? null)">{{ $cell }}</x-plinth::data-table-cell>
            @endforeach
        </x-plinth::data-table-row>
    @endforeach
</x-plinth::data-table>
