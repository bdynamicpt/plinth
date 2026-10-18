{{-- Markup contract: packages/css/src/components/button.css (icon button) --}}
@props([
    'label' => null,
    'variant' => 'ghost',
    'size' => 'md',
    'href' => null,
    'disabled' => false,
    'busy' => false,
    'pressed' => null,
    'mirror' => false,
])
@php
    // The label is the button's only name, as `label` or an aria-label attribute.
    $name = $label ?? $attributes->get('aria-label');
    if (blank($name)) {
        throw new InvalidArgumentException('<x-plinth::icon-button> needs a label: it is the only name the button has.');
    }
    $variant = \BDynamic\Plinth\Enums\ButtonVariant::resolve($variant ?? \BDynamic\Plinth\Enums\ButtonVariant::Ghost);
    $size = \BDynamic\Plinth\Enums\Size::resolve($size, \BDynamic\Plinth\Enums\Size::controls());
    $isLink = filled($href);
    $isBusy = $busy && ! $disabled;
    $root = array_filter([
        'class' => 'plinth-button plinth-icon-button',
        'type' => $isLink ? null : 'button',
        'href' => $isLink && ! $disabled ? $href : null,
        'data-variant' => $variant->value,
        'data-size' => $size->value,
        'aria-label' => $name,
        'aria-pressed' => $pressed === null || $isLink ? null : ($pressed ? 'true' : 'false'),
        'disabled' => $disabled && ! $isLink ? '' : null,
        'role' => $disabled && $isLink ? 'link' : null,
        'aria-busy' => $isBusy ? 'true' : null,
        'aria-disabled' => $isBusy || ($disabled && $isLink) ? 'true' : null,
    ], fn ($value) => $value !== null);
@endphp
<{{ $isLink ? 'a' : 'button' }} {{ $attributes->except('aria-label')->merge($root) }}>
    @if ($isBusy)
        <span class="plinth-button-spinner" aria-hidden="true"></span>
    @else
        <span class="plinth-icon" data-size="{{ $size->iconSize()->value }}" @if ($mirror) data-mirror @endif aria-hidden="true">{{ $slot }}</span>
    @endif
</{{ $isLink ? 'a' : 'button' }}>
