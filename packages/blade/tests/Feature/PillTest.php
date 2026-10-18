<?php

use Illuminate\Support\Facades\Blade;

it('prints a toggle button with its label', function () {
    expect(squish(Blade::render('<x-plinth::pill>Open</x-plinth::pill>')))
        ->toBe('<button class="plinth-pill" type="button" aria-pressed="false"><span class="plinth-pill-label">Open</span></button>');
});

it('prints the count, zero included, and leaves out an empty one', function () {
    expect(squish(Blade::render('<x-plinth::pill :count="12">Open</x-plinth::pill>')))
        ->toContain('<span class="plinth-pill-label">Open</span><span class="plinth-pill-count">12</span>');
    expect(Blade::render('<x-plinth::pill :count="0">Archived</x-plinth::pill>'))
        ->toContain('<span class="plinth-pill-count">0</span>');
    expect(Blade::render('<x-plinth::pill count="">Open</x-plinth::pill>'))
        ->not->toContain('plinth-pill-count');
});

it('marks a selected button as pressed', function () {
    expect(Blade::render('<x-plinth::pill selected>All</x-plinth::pill>'))
        ->toContain('aria-pressed="true"')
        ->not->toContain('aria-current');
});

it('is a link with an href, current when selected', function () {
    expect(Blade::render('<x-plinth::pill href="/tasks">Tasks</x-plinth::pill>'))
        ->toStartWith('<a class="plinth-pill" href="/tasks">');
    expect(Blade::render('<x-plinth::pill href="/tasks" selected>Tasks</x-plinth::pill>'))
        ->toStartWith('<a class="plinth-pill" href="/tasks" aria-current="page">')
        ->not->toContain('aria-pressed');
});

it('disables a button and a link', function () {
    expect(Blade::render('<x-plinth::pill disabled>Archived</x-plinth::pill>'))
        ->toStartWith('<button class="plinth-pill" type="button" aria-pressed="false" disabled="">');
    expect(Blade::render('<x-plinth::pill href="/reports" disabled>Reports</x-plinth::pill>'))
        ->toStartWith('<a class="plinth-pill" role="link" aria-disabled="true">')
        ->not->toContain('href');
});

it('escapes the label and the count', function () {
    $html = Blade::render('<x-plinth::pill :count="$text">{{ $text }}</x-plinth::pill>', ['text' => '<b>x</b>']);

    expect($html)->not->toContain('<b>')->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::pill class="ms-2" type="submit" wire:click="$set(\'status\', \'open\')" x-on:click="open = false">Open</x-plinth::pill>');

    expect($html)
        ->toContain('class="plinth-pill ms-2"')
        ->toContain('type="submit"')
        ->not->toContain('type="button"')
        ->toContain('wire:click="$set(\'status\', \'open\')"')
        ->toContain('x-on:click="open = false"');
});
