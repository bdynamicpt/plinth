<?php

use Illuminate\Support\Facades\Blade;

it('prints a toggle button with its label', function () {
    expect(squish(Blade::render('<x-plinth::section-menu-item>Open</x-plinth::section-menu-item>')))
        ->toBe('<button class="plinth-section-menu-item" type="button" aria-pressed="false"><span class="plinth-section-menu-label">Open</span></button>');
});

it('prints the count, zero included, and leaves out an empty one', function () {
    expect(squish(Blade::render('<x-plinth::section-menu-item :count="12">Open</x-plinth::section-menu-item>')))
        ->toContain('<span class="plinth-section-menu-label">Open</span><span class="plinth-section-menu-count">12</span>');
    expect(Blade::render('<x-plinth::section-menu-item :count="0">Archived</x-plinth::section-menu-item>'))
        ->toContain('<span class="plinth-section-menu-count">0</span>');
    foreach (['', ' ', null] as $count) {
        expect(Blade::render('<x-plinth::section-menu-item :count="$count">Open</x-plinth::section-menu-item>', ['count' => $count]))
            ->not->toContain('plinth-section-menu-count');
    }
});

it('marks the current button as pressed', function () {
    expect(Blade::render('<x-plinth::section-menu-item current>All</x-plinth::section-menu-item>'))
        ->toContain('aria-pressed="true"')
        ->not->toContain('aria-current');
});

it('is a link with an href, marked current when current', function () {
    expect(Blade::render('<x-plinth::section-menu-item href="/tasks">Tasks</x-plinth::section-menu-item>'))
        ->toStartWith('<a class="plinth-section-menu-item" href="/tasks">');
    expect(Blade::render('<x-plinth::section-menu-item href="/tasks" current>Tasks</x-plinth::section-menu-item>'))
        ->toStartWith('<a class="plinth-section-menu-item" href="/tasks" aria-current="page">')
        ->not->toContain('aria-pressed');
});

it('disables a button and a link', function () {
    expect(Blade::render('<x-plinth::section-menu-item disabled>Archived</x-plinth::section-menu-item>'))
        ->toStartWith('<button class="plinth-section-menu-item" type="button" aria-pressed="false" disabled="">');
    expect(Blade::render('<x-plinth::section-menu-item href="/reports" disabled>Reports</x-plinth::section-menu-item>'))
        ->toStartWith('<a class="plinth-section-menu-item" role="link" aria-disabled="true">')
        ->not->toContain('href');
});

it('escapes the label and the count', function () {
    $html = Blade::render('<x-plinth::section-menu-item :count="$text">{{ $text }}</x-plinth::section-menu-item>', ['text' => '<b>x</b>']);

    expect($html)->not->toContain('<b>')->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::section-menu-item class="ms-2" type="submit" wire:click="$set(\'status\', \'open\')" x-on:click="open = false">Open</x-plinth::section-menu-item>');

    expect($html)
        ->toContain('class="plinth-section-menu-item ms-2"')
        ->toContain('type="submit"')
        ->not->toContain('type="button"')
        ->toContain('wire:click="$set(\'status\', \'open\')"')
        ->toContain('x-on:click="open = false"');
});
