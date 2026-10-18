{{-- Markup contract: packages/css/src/components/sheet.css --}}
@props([
    'id' => null,
    'title' => null,
    'description' => null,
    'closeLabel' => 'Close',
    'placement' => 'center',
])
@php
    if (blank($title)) {
        throw new InvalidArgumentException('<x-plinth::sheet> needs a title: it is the sheet\'s accessible name.');
    }
    $id = filled($id) ? $id : 'plinth-sheet-'.\Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
    $hasDescription = filled($description);
    $root = array_filter([
        'id' => $id,
        'class' => 'plinth-sheet',
        'data-placement' => \BDynamic\Plinth\Enums\SheetPlacement::resolve($placement)->value,
        'closedby' => 'any',
        'aria-labelledby' => $id.'-title',
        'aria-describedby' => $hasDescription ? $id.'-description' : null,
    ], fn ($value) => $value !== null);
@endphp
<dialog {{ $attributes->merge($root) }}>
    <div class="plinth-sheet-header">
        <h2 id="{{ $id }}-title" class="plinth-sheet-title">{{ $title }}</h2>
        @if ($hasDescription)
            <p id="{{ $id }}-description" class="plinth-sheet-description">{{ $description }}</p>
        @endif
        <x-plinth::icon-button class="plinth-sheet-close" :label="$closeLabel" variant="ghost" :commandfor="$id" command="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></x-plinth::icon-button>
    </div>
    <div class="plinth-sheet-body">{{ $slot }}</div>
    @isset($footer)
        <div class="plinth-sheet-footer">{{ $footer }}</div>
    @endisset
</dialog>
