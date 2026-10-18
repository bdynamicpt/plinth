{{-- Markup contract: packages/css/src/components/section-menu.css --}}
@props([
    'count' => null,
    'href' => null,
    'current' => false,
    'disabled' => false,
])
@php
    $tag = filled($href) ? 'a' : 'button';
    $root = array_filter([
        'class' => 'plinth-section-menu-item',
        'type' => $tag === 'button' ? 'button' : null,
        'href' => $tag === 'a' && ! $disabled ? $href : null,
        'aria-pressed' => $tag === 'button' ? ($current ? 'true' : 'false') : null,
        'aria-current' => $tag === 'a' && $current ? 'page' : null,
        'disabled' => $tag === 'button' && $disabled ? '' : null,
        'role' => $tag === 'a' && $disabled ? 'link' : null,
        'aria-disabled' => $tag === 'a' && $disabled ? 'true' : null,
    ], fn ($value) => $value !== null);
@endphp
<{{ $tag }} {{ $attributes->merge($root) }}>
    <span class="plinth-section-menu-label">{{ $slot }}</span>
    @if (filled($count))
        <span class="plinth-section-menu-count">{{ $count }}</span>
    @endif
</{{ $tag }}>
