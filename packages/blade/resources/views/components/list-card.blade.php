{{-- Markup contract: packages/css/src/components/list-card.css --}}
@props([
    'heading' => null,
    'headingLevel' => 'h2',
    'footer' => null,
])
@php
    $level = \BDynamic\Plinth\Enums\HeadingLevel::resolve($headingLevel)->value;
@endphp
<div {{ $attributes->merge(['class' => 'plinth-list-card']) }}>
    @if (filled($heading))
        <{{ $level }} class="plinth-list-card-heading">{{ $heading }}</{{ $level }}>
    @endif
    <ul class="plinth-list-card-list" role="list">{{ $slot }}</ul>
    @if (filled($footer))
        <p class="plinth-list-card-footer">{{ $footer }}</p>
    @endif
</div>
