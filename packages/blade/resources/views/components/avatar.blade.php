{{-- Markup contract: packages/css/src/components/avatar.css --}}
@props([
    'name' => null,
    'src' => null,
    'initials' => null,
    'size' => 'md',
    'status' => null,
    'statusLabel' => null,
    'decorative' => false,
])
@php
    if (! $decorative && blank($name)) {
        throw new InvalidArgumentException('<x-plinth::avatar> needs a name, or decorative when the name is shown next to it.');
    }
    $size = \BDynamic\Plinth\Enums\AvatarSize::resolve($size);
    $tone = $status === null ? null : \BDynamic\Plinth\Enums\Tone::resolve($status);
    $label = $decorative ? null : ($tone && filled($statusLabel) ? "{$name}, {$statusLabel}" : $name);
    $letters = $initials ?? \BDynamic\Plinth\Support\Initials::from($name);
@endphp
<span {{ $attributes->merge(array_filter([
    'class' => 'plinth-avatar',
    'data-size' => $size->value,
    'role' => $label === null ? null : 'img',
    'aria-label' => $label,
    'aria-hidden' => $decorative ? 'true' : null,
], fn ($value) => $value !== null)) }}>
    @if (filled($src))
        <img class="plinth-avatar-image" src="{{ $src }}" alt="">
    @elseif (filled($letters))
        <span class="plinth-avatar-initials" aria-hidden="true">{{ $letters }}</span>
    @else
        <svg class="plinth-avatar-glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="9" r="4"></circle><path d="M4.5 20a7.5 7.5 0 0 1 15 0"></path></svg>
    @endif
    @if ($tone)
        <span class="plinth-avatar-status" data-tone="{{ $tone->value }}" aria-hidden="true"></span>
    @endif
</span>
