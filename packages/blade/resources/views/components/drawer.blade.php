{{-- Markup contract: packages/css/src/components/drawer.css --}}
@props([
    'id' => null,
    'title' => null,
    'description' => null,
    'closeLabel' => 'Close',
    'desktop' => 'dialog',
    'snapPoints' => null,
    'snap' => null,
])
@php
    if (blank($title)) {
        throw new InvalidArgumentException('<x-plinth::drawer> needs a title: it is the drawer\'s accessible name.');
    }
    $id = filled($id) ? trim($id) : 'plinth-drawer-'.\Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
    $hasDescription = filled($description);
    $points = \BDynamic\Plinth\Enums\DrawerSnap::points($snapPoints);
    $root = array_filter([
        'id' => $id,
        'class' => 'plinth-drawer',
        'data-desktop' => \BDynamic\Plinth\Enums\DrawerDesktop::resolve($desktop)->value,
        'data-snap-points' => $points === [] ? null : implode(' ', array_column($points, 'value')),
        'data-snap' => \BDynamic\Plinth\Enums\DrawerSnap::opensAt($snap, $points)?->value,
        'closedby' => 'any',
        // Dragged down to close, and opened at its snap point (modal.css).
        'x-init' => \BDynamic\Plinth\Support\SwipeToClose::ALPINE,
        'aria-labelledby' => $id.'-title',
        'aria-describedby' => $hasDescription ? $id.'-description' : null,
    ], fn ($value) => $value !== null);
@endphp
<dialog {{ $attributes->merge($root) }}>
    <div class="plinth-drawer-panel">
        <div class="plinth-drawer-handle" aria-hidden="true"></div>
        <div class="plinth-drawer-header">
            <h2 id="{{ $id }}-title" class="plinth-drawer-title">{{ $title }}</h2>
            @if ($hasDescription)
                <p id="{{ $id }}-description" class="plinth-drawer-description">{{ $description }}</p>
            @endif
            <x-plinth::icon-button class="plinth-drawer-close" :label="$closeLabel" variant="ghost" :commandfor="$id" command="close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg></x-plinth::icon-button>
        </div>
        <div class="plinth-drawer-body">{{ $slot }}</div>
        @if (isset($footer) && $footer->hasActualContent())
            <div class="plinth-drawer-footer">{{ $footer }}</div>
        @endif
    </div>
</dialog>
