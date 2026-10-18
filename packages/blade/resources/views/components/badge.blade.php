{{-- Markup contract: packages/css/src/components/badge.css --}}
@props([
    'tone' => 'neutral',
    'dot' => false,
])
<span {{ $attributes->merge(['class' => 'plinth-badge', 'data-tone' => \BDynamic\Plinth\Plinth::tone($tone)]) }}>
    @if ($dot)
        <span class="plinth-badge-dot" aria-hidden="true"></span>
    @endif
    <span class="plinth-badge-label">{{ $slot }}</span>
</span>
