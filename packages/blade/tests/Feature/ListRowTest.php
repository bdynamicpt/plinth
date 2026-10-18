<?php

use Illuminate\Support\Facades\Blade;

it('prints a static row with its title', function () {
    expect(squish(Blade::render('<x-plinth::list-row>Notifications</x-plinth::list-row>')))
        ->toBe('<div class="plinth-list-row"><span class="plinth-list-row-content"><span class="plinth-list-row-title">Notifications</span></span></div>');
});

it('prints the description, the leading and the trailing slot', function () {
    $html = squish(Blade::render(<<<'BLADE'
        <x-plinth::list-row description="Email and push">
            <x-slot:leading><i>bell</i></x-slot:leading>
            Notifications
            <x-slot:trailing>On</x-slot:trailing>
        </x-plinth::list-row>
        BLADE));

    expect($html)
        ->toContain('<span class="plinth-list-row-leading"><i>bell</i></span>')
        ->toContain('<span class="plinth-list-row-description">Email and push</span>')
        ->toContain('<span class="plinth-list-row-trailing">On</span>');
});

it('leaves out an empty description', function () {
    expect(Blade::render('<x-plinth::list-row description="">Notifications</x-plinth::list-row>'))
        ->not->toContain('plinth-list-row-description');
});

it('prints the chevron in the trailing slot', function () {
    expect(squish(Blade::render('<x-plinth::list-row chevron>Language</x-plinth::list-row>')))
        ->toContain('<span class="plinth-list-row-trailing"><span class="plinth-icon plinth-list-row-chevron" data-size="sm" data-mirror aria-hidden="true"><svg');
});

it('is a link with an href, and a button with button', function () {
    expect(Blade::render('<x-plinth::list-row href="/language" button>Language</x-plinth::list-row>'))
        ->toStartWith('<a class="plinth-list-row" href="/language">')
        ->not->toContain('type="button"');
    expect(Blade::render('<x-plinth::list-row button>Sign out</x-plinth::list-row>'))
        ->toStartWith('<button class="plinth-list-row" type="button">');
});

it('marks the current row, but never a button', function () {
    expect(Blade::render('<x-plinth::list-row href="/" current>Overview</x-plinth::list-row>'))
        ->toContain('aria-current="page"');
    expect(Blade::render('<x-plinth::list-row current>Overview</x-plinth::list-row>'))
        ->toContain('aria-current="page"');
    expect(Blade::render('<x-plinth::list-row button current>Overview</x-plinth::list-row>'))
        ->not->toContain('aria-current');
});

it('disables a button, a link, and leaves a static row alone', function () {
    expect(Blade::render('<x-plinth::list-row button disabled>Export</x-plinth::list-row>'))
        ->toContain(' disabled');
    expect(Blade::render('<x-plinth::list-row href="/billing" disabled>Billing</x-plinth::list-row>'))
        ->toStartWith('<a class="plinth-list-row" role="link" aria-disabled="true">')
        ->not->toContain('href');
    expect(Blade::render('<x-plinth::list-row disabled>Billing</x-plinth::list-row>'))
        ->toStartWith('<div class="plinth-list-row">');
});

it('escapes the title and the description', function () {
    $html = Blade::render(
        '<x-plinth::list-row :description="$text">{{ $text }}</x-plinth::list-row>',
        ['text' => '<b>x</b>'],
    );

    expect($html)->not->toContain('<b>')->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::list-row button class="ms-2" type="submit" wire:click="signOut" x-on:click="open = false">Sign out</x-plinth::list-row>');

    expect($html)
        ->toContain('class="plinth-list-row ms-2"')
        ->toContain('type="submit"')
        ->not->toContain('type="button"')
        ->toContain('wire:click="signOut"')
        ->toContain('x-on:click="open = false"');
});
