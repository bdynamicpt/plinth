{{-- Markup contract: packages/css/src/components/button.css --}}
@props([
    'variant' => 'primary',
    'size' => 'md',
    'href' => null,
    'disabled' => false,
    'busy' => false,
    'mirrorIcon' => false,
    'mirrorTrailing' => false,
])
@php
    $variant = \BDynamic\Plinth\Plinth::buttonVariant($variant);
    $size = \BDynamic\Plinth\Plinth::buttonSize($size);
    $iconSize = $size === 'sm' ? 'sm' : 'md';
    $isLink = filled($href);
    $isBusy = $busy && ! $disabled;
    $root = array_filter([
        'class' => 'plinth-button',
        'type' => $isLink ? null : 'button',
        'href' => $isLink && ! $disabled ? $href : null,
        'data-variant' => $variant,
        'data-size' => $size,
        'disabled' => $disabled && ! $isLink ? '' : null,
        'role' => $disabled && $isLink ? 'link' : null,
        'aria-busy' => $isBusy ? 'true' : null,
        'aria-disabled' => $isBusy || ($disabled && $isLink) ? 'true' : null,
    ], fn ($value) => $value !== null);
@endphp
<{{ $isLink ? 'a' : 'button' }} {{ $attributes->merge($root) }}>
    @if ($isBusy)
        <span class="plinth-button-spinner" aria-hidden="true"></span>
    @elseif (isset($icon))
        <span class="plinth-icon" data-size="{{ $iconSize }}" @if ($mirrorIcon) data-mirror @endif aria-hidden="true">{{ $icon }}</span>
    @endif
    <span class="plinth-button-label">{{ $slot }}</span>
    @isset($trailing)
        <span class="plinth-icon" data-size="{{ $iconSize }}" @if ($mirrorTrailing) data-mirror @endif aria-hidden="true">{{ $trailing }}</span>
    @endisset
</{{ $isLink ? 'a' : 'button' }}>
