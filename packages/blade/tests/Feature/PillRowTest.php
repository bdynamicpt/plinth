<?php

use Illuminate\Support\Facades\Blade;

it('prints a named group with its pills', function () {
    expect(squish(Blade::render('<x-plinth::pill-row label="Status"><i>pills</i></x-plinth::pill-row>')))
        ->toBe('<div class="plinth-pill-row" role="group" aria-label="Status"><i>pills</i></div>');
});

it('leaves out an empty label', function () {
    expect(squish(Blade::render('<x-plinth::pill-row label="">x</x-plinth::pill-row>')))
        ->toBe('<div class="plinth-pill-row" role="group">x</div>');
});

it('is a nav with nav', function () {
    expect(squish(Blade::render('<x-plinth::pill-row label="Sections" nav>x</x-plinth::pill-row>')))
        ->toBe('<nav class="plinth-pill-row" aria-label="Sections">x</nav>');
});

it('escapes the label', function () {
    expect(Blade::render('<x-plinth::pill-row :label="$text">x</x-plinth::pill-row>', ['text' => '"><b>x</b>']))
        ->not->toContain('<b>')
        ->toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"');
});

it('passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::pill-row class="mb-4" aria-labelledby="status-title" x-data="{ open: false }">x</x-plinth::pill-row>');

    expect($html)
        ->toContain('class="plinth-pill-row mb-4"')
        ->toContain('aria-labelledby="status-title"')
        ->toContain('x-data="{ open: false }"');
});
