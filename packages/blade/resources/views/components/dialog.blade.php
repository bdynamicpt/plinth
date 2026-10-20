{{-- Markup contract: packages/css/src/components/dialog.css --}}
@props([
    'id' => null,
    'title' => null,
    'description' => null,
    'closeLabel' => 'Close',
    'dismissible' => true,
    'sidePhone' => 'center',
])
@php
    if (blank($title)) {
        throw new InvalidArgumentException('<x-plinth::dialog> needs a title: it is the dialog\'s accessible name.');
    }
    $id = filled($id) ? trim($id) : 'plinth-dialog-'.\Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
    $hasDescription = filled($description);
    $sidePhone = \BDynamic\Plinth\Enums\DialogSidePhone::resolve($sidePhone);
    // A bottom sheet on a phone that can be dismissed has the grab handle (modal.css).
    $handle = $dismissible && $sidePhone === \BDynamic\Plinth\Enums\DialogSidePhone::Bottom;
    $root = array_filter([
        'id' => $id,
        'class' => 'plinth-dialog',
        'role' => $dismissible ? null : 'alertdialog',
        'data-side-phone' => $sidePhone === \BDynamic\Plinth\Enums\DialogSidePhone::Center ? null : $sidePhone->value,
        'closedby' => $dismissible ? 'any' : 'closerequest',
        'x-init' => $handle ? \BDynamic\Plinth\Support\SwipeToClose::ALPINE : null,
        'aria-labelledby' => $id.'-title',
        'aria-describedby' => $hasDescription ? $id.'-description' : null,
    ], fn ($value) => $value !== null);
@endphp
<dialog {{ $attributes->merge($root) }}>
    <div class="plinth-dialog-panel">
        @if ($handle)
            <div class="plinth-dialog-handle" aria-hidden="true"></div>
        @endif
        <div class="plinth-dialog-header">
            <h2 id="{{ $id }}-title" class="plinth-dialog-title">{{ $title }}</h2>
            @if ($hasDescription)
                <p id="{{ $id }}-description" class="plinth-dialog-description">{{ $description }}</p>
            @endif
            @if ($dismissible)
                <x-plinth::icon-button class="plinth-dialog-close" :label="$closeLabel" variant="ghost" :commandfor="$id" command="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></x-plinth::icon-button>
            @endif
        </div>
        <div class="plinth-dialog-body">{{ $slot }}</div>
        @if (isset($footer) && $footer->hasActualContent())
            <div class="plinth-dialog-footer">{{ $footer }}</div>
        @endif
    </div>
</dialog>
