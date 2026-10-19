{{-- A fenced code block: highlighted, in Plinth's code block, with tabs when it has them. --}}
@if ($tabs !== [])
    <x-plinth::code-block :tabs="$tabs" />
@else
    <x-plinth::code-block :label="$label">{{ $html }}</x-plinth::code-block>
@endif
