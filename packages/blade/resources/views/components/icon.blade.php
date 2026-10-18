{{-- Markup contract: packages/css/src/components/icon.css --}}
@props([
    'size' => 'md',
    'label' => null,
    'mirror' => false,
])
@php
    // The label can also come as an aria-label attribute; a blank one leaves the icon decorative.
    $name = $label ?? $attributes->get('aria-label');
    $name = filled($name) ? $name : null;
@endphp
<span {{ $attributes->except('aria-label')->merge(array_filter([
    'class' => 'plinth-icon',
    'data-size' => \BDynamic\Plinth\Enums\IconSize::resolve($size)->value,
    'data-mirror' => $mirror ? '' : null,
    'role' => $name !== null ? 'img' : null,
    'aria-label' => $name,
    'aria-hidden' => $name !== null ? null : 'true',
], fn ($value) => $value !== null)) }}>{{ $slot }}</span>
