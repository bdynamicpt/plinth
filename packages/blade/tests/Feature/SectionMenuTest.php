<?php

use Illuminate\Support\Facades\Blade;

it('prints a named nav with its items', function () {
    expect(squish(Blade::render('<x-plinth::section-menu label="Project"><i>items</i></x-plinth::section-menu>')))
        ->toBe('<nav class="plinth-section-menu" aria-label="Project"><i>items</i></nav>');
});

it('leaves out an empty label', function () {
    expect(squish(Blade::render('<x-plinth::section-menu label="">x</x-plinth::section-menu>')))
        ->toBe('<nav class="plinth-section-menu">x</nav>');
});

it('is a group without nav', function () {
    expect(squish(Blade::render('<x-plinth::section-menu label="View" :nav="false">x</x-plinth::section-menu>')))
        ->toBe('<div class="plinth-section-menu" role="group" aria-label="View">x</div>');
});

it('escapes the label', function () {
    expect(Blade::render('<x-plinth::section-menu :label="$text">x</x-plinth::section-menu>', ['text' => '"><b>x</b>']))
        ->not->toContain('<b>')
        ->toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"');
});

it('passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::section-menu class="sticky" aria-labelledby="project-title" x-data="{ open: false }">x</x-plinth::section-menu>');

    expect($html)
        ->toContain('class="plinth-section-menu sticky"')
        ->toContain('aria-labelledby="project-title"')
        ->toContain('x-data="{ open: false }"');
});
