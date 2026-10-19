<?php

use BDynamic\Plinth\Enums\CalloutRole;
use BDynamic\Plinth\Enums\CalloutTone;
use Illuminate\Support\Facades\Blade;

it('prints the callout markup contract', function () {
    $html = Blade::render(<<<'BLADE'
        <x-plinth::callout tone="warning" title="Your trial ends in 3 days">
            Add a payment method.
            <x-slot:actions><button type="button">Add</button></x-slot:actions>
        </x-plinth::callout>
        BLADE);

    expect(squish($html))->toBe(
        '<div class="plinth-callout" data-tone="warning" role="note">'
        .'<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">'.CalloutTone::Warning->icon().'</span>'
        .'<div class="plinth-callout-body">'
        .'<p class="plinth-callout-title">Your trial ends in 3 days</p>'
        .'<div class="plinth-callout-text">Add a payment method.</div>'
        .'<div class="plinth-callout-actions"><button type="button">Add</button></div>'
        .'</div></div>'
    );
});

it('is a neutral note with only the text by default', function () {
    expect(squish(Blade::render('<x-plinth::callout>Drafts are private.</x-plinth::callout>')))->toBe(
        '<div class="plinth-callout" data-tone="neutral" role="note">'
        .'<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true">'.CalloutTone::Neutral->icon().'</span>'
        .'<div class="plinth-callout-body"><div class="plinth-callout-text">Drafts are private.</div></div></div>'
    );
});

it('prints every tone with its own icon', function (CalloutTone $tone) {
    expect(Blade::render('<x-plinth::callout :tone="$tone">Text</x-plinth::callout>', ['tone' => $tone->value]))
        ->toContain('data-tone="'.$tone->value.'"')
        ->toContain($tone->icon());
})->with(CalloutTone::cases());

it('gives each tone a different icon', function () {
    $icons = array_map(fn (CalloutTone $tone) => $tone->icon(), CalloutTone::cases());

    expect(array_unique($icons))->toHaveCount(count(CalloutTone::cases()));
});

it('prints every role', function (CalloutRole $role) {
    expect(Blade::render('<x-plinth::callout :role="$role">Text</x-plinth::callout>', ['role' => $role]))
        ->toContain('role="'.$role->value.'"');
})->with(CalloutRole::cases());

it('takes the tone as an enum case', function () {
    expect(Blade::render('<x-plinth::callout :tone="\\BDynamic\\Plinth\\Enums\\CalloutTone::Danger">Text</x-plinth::callout>'))
        ->toContain('data-tone="danger"');
});

it('falls back to a neutral note for a tone or role it does not know', function () {
    $html = Blade::render('<x-plinth::callout tone="loud" role="log">Text</x-plinth::callout>');

    expect($html)
        ->toContain('data-tone="neutral"')
        ->toContain('role="note"');
});

it('leaves out a blank title, text and actions', function () {
    $html = Blade::render('<x-plinth::callout title=" "> <x-slot:actions> </x-slot:actions></x-plinth::callout>');

    expect($html)
        ->not->toContain('plinth-callout-title')
        ->not->toContain('plinth-callout-text')
        ->not->toContain('plinth-callout-actions');
});

it('takes the title as a slot with markup', function () {
    $html = Blade::render('<x-plinth::callout><x-slot:title>Read <code>brand.css</code></x-slot:title> Text</x-plinth::callout>');

    expect(squish($html))->toContain('<p class="plinth-callout-title">Read <code>brand.css</code></p>');
});

it('puts a project\'s icon in place of the tone\'s', function () {
    $html = squish(Blade::render('<x-plinth::callout tone="info"><x-slot:icon><svg id="bell"></svg></x-slot:icon> Text</x-plinth::callout>'));

    expect($html)
        ->toContain('<span class="plinth-icon plinth-callout-icon" data-size="md" aria-hidden="true"><svg id="bell"></svg></span>')
        ->not->toContain(CalloutTone::Info->icon());
});

it('escapes the title and the text', function () {
    $html = Blade::render('<x-plinth::callout :title="$title">{{ $text }}</x-plinth::callout>', ['title' => '<b>t</b>', 'text' => '<i>x</i>']);

    expect($html)
        ->toContain('&lt;b&gt;t&lt;/b&gt;')
        ->toContain('&lt;i&gt;x&lt;/i&gt;');
});

it('passes Livewire and Alpine attributes to its root', function () {
    $html = Blade::render('<x-plinth::callout wire:key="trial" x-show="visible">Text</x-plinth::callout>');

    expect($html)
        ->toContain('wire:key="trial"')
        ->toContain('x-show="visible"');
});

it('keeps extra classes and attributes', function () {
    $html = Blade::render('<x-plinth::callout class="mb-4" id="trial" aria-labelledby="trial-title">Text</x-plinth::callout>');

    expect($html)
        ->toContain('class="plinth-callout mb-4"')
        ->toContain('id="trial"')
        ->toContain('aria-labelledby="trial-title"');
});
