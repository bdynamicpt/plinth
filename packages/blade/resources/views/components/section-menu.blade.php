{{-- Markup contract: packages/css/src/components/section-menu.css --}}
@props([
    'label' => null,
    'nav' => true,
])
@php
    $tag = $nav ? 'nav' : 'div';
    $root = array_filter([
        'class' => 'plinth-section-menu',
        'role' => $nav ? null : 'group',
        'aria-label' => filled($label) ? $label : null,
    ], fn ($value) => $value !== null);
@endphp
<{{ $tag }} {{ $attributes->merge($root) }}>{{ $slot }}</{{ $tag }}>
