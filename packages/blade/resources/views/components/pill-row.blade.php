{{-- Markup contract: packages/css/src/components/pill-row.css --}}
@props([
    'label' => null,
    'nav' => false,
])
@php
    $tag = $nav ? 'nav' : 'div';
    $root = array_filter([
        'class' => 'plinth-pill-row',
        'role' => $nav ? null : 'group',
        'aria-label' => filled($label) ? $label : null,
    ], fn ($value) => $value !== null);
@endphp
<{{ $tag }} {{ $attributes->merge($root) }}>{{ $slot }}</{{ $tag }}>
