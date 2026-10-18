<?php

use Illuminate\Support\Facades\Blade;

it('prints the header, the leading action, the title and the actions', function () {
    $html = Blade::render(
        '<x-plinth::header title="Inbox">'
        .'<x-slot:leading><a href="/">Back</a></x-slot:leading>'
        .'<x-slot:actions><button type="button">Search</button></x-slot:actions>'
        .'</x-plinth::header>'
    );

    expect(squish($html))->toBe(
        '<header class="plinth-header">'
        .'<div class="plinth-header-leading"><a href="/">Back</a></div>'
        .'<h1 class="plinth-header-title">Inbox</h1>'
        .'<div class="plinth-header-actions"><button type="button">Search</button></div>'
        .'</header>'
    );
});

it('prints only the title without a leading action or actions', function () {
    expect(squish(Blade::render('<x-plinth::header title="Settings" />')))
        ->toBe('<header class="plinth-header"><h1 class="plinth-header-title">Settings</h1></header>');
});

it('leaves out blank slots', function () {
    $html = Blade::render(
        '<x-plinth::header title="Settings"><x-slot:leading> </x-slot:leading><x-slot:actions>'
        .'@if (false) x @endif</x-slot:actions></x-plinth::header>'
    );

    expect($html)
        ->not->toContain('plinth-header-leading')
        ->not->toContain('plinth-header-actions');
});

it('needs a title', function () {
    foreach (['<x-plinth::header />', '<x-plinth::header title=" " />'] as $template) {
        expect(fn () => Blade::render($template))->toThrow(Exception::class, 'needs a title');
    }
});

it('escapes the title', function () {
    expect(Blade::render('<x-plinth::header :title="$title" />', ['title' => '<b>x</b>']))
        ->toContain('<h1 class="plinth-header-title">&lt;b&gt;x&lt;/b&gt;</h1>');
});

it('keeps extra classes and attributes on the root', function () {
    $html = Blade::render(
        '<x-plinth::header title="Inbox" class="is-scrolled" id="top" wire:key="header" x-ref="header" data-testid="header" aria-label="Inbox" />'
    );

    expect($html)
        ->toContain('class="plinth-header is-scrolled"')
        ->toContain('id="top"')
        ->toContain('wire:key="header"')
        ->toContain('x-ref="header"')
        ->toContain('data-testid="header"')
        ->toContain('aria-label="Inbox"');
});
