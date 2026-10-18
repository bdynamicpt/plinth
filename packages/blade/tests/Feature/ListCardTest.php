<?php

use BDynamic\Plinth\Enums\HeadingLevel;
use Illuminate\Support\Facades\Blade;

$rows = '<li><div class="plinth-list-row">Email</div></li>';

it('prints the heading, the rows and the footer', function () use ($rows) {
    expect(squish(Blade::render('<x-plinth::list-card heading="Account" footer="On this device only.">'.$rows.'</x-plinth::list-card>')))
        ->toBe('<div class="plinth-list-card"><h2 class="plinth-list-card-heading">Account</h2>'
            .'<ul class="plinth-list-card-list" role="list">'.$rows.'</ul>'
            .'<p class="plinth-list-card-footer">On this device only.</p></div>');
});

it('leaves out an empty heading and footer', function () {
    expect(squish(Blade::render('<x-plinth::list-card heading="" footer=""></x-plinth::list-card>')))
        ->toBe('<div class="plinth-list-card"><ul class="plinth-list-card-list" role="list"></ul></div>');
});

it('leaves out a heading and footer of only spaces', function () {
    expect(squish(Blade::render('<x-plinth::list-card heading="  " footer=" "></x-plinth::list-card>')))
        ->toBe('<div class="plinth-list-card"><ul class="plinth-list-card-list" role="list"></ul></div>');
});

it('takes a heading level, and falls back to h2', function () {
    $heading = fn (mixed $level) => squish(Blade::render(
        '<x-plinth::list-card heading="Display" :heading-level="$level"></x-plinth::list-card>',
        ['level' => $level],
    ));

    expect($heading('h3'))->toContain('<h3 class="plinth-list-card-heading">Display</h3>')
        ->and($heading(HeadingLevel::Six))->toContain('<h6 class="plinth-list-card-heading">Display</h6>')
        ->and($heading('h1'))->toContain('<h2 class="plinth-list-card-heading">Display</h2>')
        ->and($heading(null))->toContain('<h2 class="plinth-list-card-heading">Display</h2>');
});

it('escapes the heading and the footer', function () {
    $html = Blade::render(
        '<x-plinth::list-card :heading="$heading" :footer="$footer"></x-plinth::list-card>',
        ['heading' => '<b>x</b>', 'footer' => '<i>y</i>'],
    );

    expect($html)
        ->not->toContain('<b>')
        ->not->toContain('<i>')
        ->toContain('&lt;b&gt;x&lt;/b&gt;')
        ->toContain('&lt;i&gt;y&lt;/i&gt;');
});

it('passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::list-card class="mb-4" id="account" wire:key="account"></x-plinth::list-card>');

    expect($html)
        ->toContain('class="plinth-list-card mb-4"')
        ->toContain('id="account"')
        ->toContain('wire:key="account"');
});
