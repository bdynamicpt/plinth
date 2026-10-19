{{-- Markup contract: packages/css/src/components/callout.css --}}
@props([
    'tone' => 'neutral',
    'role' => 'note',
    'title' => null,
    'icon' => null,
    'actions' => null,
])
@php
    $tone = \BDynamic\Plinth\Enums\CalloutTone::resolve($tone);
    $filled = fn ($value) => $value instanceof \Illuminate\View\ComponentSlot ? $value->hasActualContent() : filled($value);
@endphp
<div {{ $attributes->merge(['class' => 'plinth-callout', 'data-tone' => $tone->value, 'role' => \BDynamic\Plinth\Enums\CalloutRole::resolve($role)->value]) }}>
    <span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">{{ $filled($icon) ? $icon : new \Illuminate\Support\HtmlString($tone->icon()) }}</span>
    <div class="plinth-callout-body">
        @if ($filled($title))
            <p class="plinth-callout-title">{{ $title }}</p>
        @endif
        @if ($slot->hasActualContent())
            <div class="plinth-callout-text">{{ $slot }}</div>
        @endif
        @if ($filled($actions))
            <div class="plinth-callout-actions">{{ $actions }}</div>
        @endif
    </div>
</div>
