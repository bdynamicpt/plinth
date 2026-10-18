{{-- Markup contract: packages/css/src/components/header.css --}}
@props([
    'title' => null,
])
@php
    if (blank($title)) {
        throw new InvalidArgumentException('<x-plinth::header> needs a title: it is the page\'s heading.');
    }
@endphp
<header {{ $attributes->merge(['class' => 'plinth-header']) }}>
    @if (isset($leading) && $leading->hasActualContent())
        <div class="plinth-header-leading">{{ $leading }}</div>
    @endif
    <h1 class="plinth-header-title">{{ $title }}</h1>
    @if (isset($actions) && $actions->hasActualContent())
        <div class="plinth-header-actions">{{ $actions }}</div>
    @endif
</header>
