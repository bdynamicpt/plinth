{{-- Markup contract: packages/css/src/components/pill-row.css --}}
@props([
    'count' => null,
    'href' => null,
    'selected' => false,
    'disabled' => false,
])
@php
    $tag = filled($href) ? 'a' : 'button';
    $root = array_filter([
        'class' => 'plinth-pill',
        'type' => $tag === 'button' ? 'button' : null,
        'href' => $tag === 'a' && ! $disabled ? $href : null,
        'aria-pressed' => $tag === 'button' ? ($selected ? 'true' : 'false') : null,
        'aria-current' => $tag === 'a' && $selected ? 'page' : null,
        'disabled' => $tag === 'button' && $disabled ? '' : null,
        'role' => $tag === 'a' && $disabled ? 'link' : null,
        'aria-disabled' => $tag === 'a' && $disabled ? 'true' : null,
    ], fn ($value) => $value !== null);
@endphp
<{{ $tag }} {{ $attributes->merge($root) }}>
    <span class="plinth-pill-label">{{ $slot }}</span>
    @if (filled($count))
        <span class="plinth-pill-count">{{ $count }}</span>
    @endif
</{{ $tag }}>
