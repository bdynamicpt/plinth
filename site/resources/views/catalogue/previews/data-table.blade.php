<x-plinth::data-table class="site-catalogue-fill">
    <x-slot:head>
        <x-plinth::data-table-column>Client</x-plinth::data-table-column>
        <x-plinth::data-table-column>Status</x-plinth::data-table-column>
        <x-plinth::data-table-column numeric>Total</x-plinth::data-table-column>
    </x-slot:head>
    <x-plinth::data-table-row>
        <x-plinth::data-table-cell kind="title" label="Client">Atlas Studio</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Status"><x-plinth::badge tone="success">Paid</x-plinth::badge></x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Total" numeric>€1,240</x-plinth::data-table-cell>
    </x-plinth::data-table-row>
    <x-plinth::data-table-row>
        <x-plinth::data-table-cell kind="title" label="Client">Kestrel Labs</x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Status"><x-plinth::badge tone="warning">Due</x-plinth::badge></x-plinth::data-table-cell>
        <x-plinth::data-table-cell label="Total" numeric>€380</x-plinth::data-table-cell>
    </x-plinth::data-table-row>
</x-plinth::data-table>
