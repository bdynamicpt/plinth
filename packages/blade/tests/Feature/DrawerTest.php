<?php

use BDynamic\Plinth\Enums\DrawerDesktop;
use BDynamic\Plinth\Enums\DrawerSnap;
use BDynamic\Plinth\Support\SwipeToClose;
use Illuminate\Support\Facades\Blade;

$close = '<button class="plinth-button plinth-icon-button plinth-drawer-close" type="button"'
    .' data-variant="ghost" data-size="md" aria-label="Close" commandfor="route" command="close">'
    .'<span class="plinth-icon" data-size="md" aria-hidden="true">'
    .'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>'
    .'</span></button>';

$drawer = fn (string $props = '', string $body = 'Body') => squish(Blade::render(
    '<x-plinth::drawer id="route" title="Route" '.$props.'>'.$body.'</x-plinth::drawer>'
));

it('prints the dialog, the panel with its handle, the header, the body and the footer', function () use ($close) {
    $html = Blade::render(
        '<x-plinth::drawer id="route" title="Route" description="12 min by bike." snap-points="peek half full" snap="peek">'
        .'<p>Body</p><x-slot:footer><button type="button">Start</button></x-slot:footer></x-plinth::drawer>'
    );

    expect(squish($html))->toBe(
        '<dialog id="route" class="plinth-drawer" data-desktop="dialog" data-snap-points="peek half full" data-snap="peek"'
        .' closedby="any" x-init="'.e(SwipeToClose::ALPINE).'"'
        .' aria-labelledby="route-title" aria-describedby="route-description">'
        .'<div class="plinth-drawer-panel">'
        .'<div class="plinth-drawer-handle" aria-hidden="true"></div>'
        .'<div class="plinth-drawer-header">'
        .'<h2 id="route-title" class="plinth-drawer-title">Route</h2>'
        .'<p id="route-description" class="plinth-drawer-description">12 min by bike.</p>'
        .$close
        .'</div>'
        .'<div class="plinth-drawer-body"><p>Body</p></div>'
        .'<div class="plinth-drawer-footer"><button type="button">Start</button></div>'
        .'</div>'
        .'</dialog>'
    );
});

it('has no snap points, no description and no footer unless it is given them', function () use ($drawer) {
    expect($drawer('description=" "'))
        ->not->toContain('data-snap')
        ->not->toContain('aria-describedby')
        ->not->toContain('plinth-drawer-description')
        ->not->toContain('plinth-drawer-footer')
        ->toEndWith('<div class="plinth-drawer-body">Body</div></div></dialog>')
        ->and($drawer('', 'Body<x-slot:footer> </x-slot:footer>'))->not->toContain('plinth-drawer-footer');
});

it('takes a presentation from 768px up, and falls back to dialog', function () {
    $desktop = fn (mixed $value) => Blade::render(
        '<x-plinth::drawer id="route" title="Route" :desktop="$value">Body</x-plinth::drawer>',
        ['value' => $value],
    );

    expect($desktop('sheet'))->toContain('data-desktop="sheet"')
        ->and($desktop(DrawerDesktop::Sheet))->toContain('data-desktop="sheet"')
        ->and($desktop('side'))->toContain('data-desktop="dialog"')
        ->and($desktop(null))->toContain('data-desktop="dialog"');
});

it('takes its snap points as a list or a string: the known ones, once, smallest first', function () {
    $points = fn (mixed $value, mixed $snap = null) => Blade::render(
        '<x-plinth::drawer id="route" title="Route" :snap-points="$value" :snap="$snap">Body</x-plinth::drawer>',
        ['value' => $value, 'snap' => $snap],
    );

    expect($points('full  peek'))->toContain('data-snap-points="peek full" data-snap="full"')
        ->and($points(['half', DrawerSnap::Peek, 'top', 'half']))->toContain('data-snap-points="peek half" data-snap="half"')
        ->and($points('peek half', 'peek'))->toContain('data-snap="peek"')
        ->and($points('peek half', DrawerSnap::Peek))->toContain('data-snap="peek"')
        ->and($points('peek half', 'full'))->toContain('data-snap="half"')
        ->and($points('top', 'peek'))->not->toContain('data-snap')
        ->and($points([]))->not->toContain('data-snap');
});

it('takes the close button\'s label, and generates an id when it has none', function () {
    $html = Blade::render('<x-plinth::drawer title="Rota" close-label="Fechar">Body</x-plinth::drawer>');
    preg_match('/id="(plinth-drawer-[a-z0-9]{8})"/', $html, $id);

    expect($id)->toHaveCount(2)
        ->and($html)->toContain('aria-labelledby="'.$id[1].'-title"')
        ->toContain('<h2 id="'.$id[1].'-title"')
        ->toContain('aria-label="Fechar" commandfor="'.$id[1].'"');
});

it('trims the id it is given', function () {
    expect(Blade::render('<x-plinth::drawer id=" route " title="Route">Body</x-plinth::drawer>'))
        ->toContain('id="route"');
});

it('needs a title', function () {
    Blade::render('<x-plinth::drawer id="route">Body</x-plinth::drawer>');
})->throws(Exception::class, 'needs a title');

it('escapes the title, the description and the id', function () {
    $html = Blade::render(
        '<x-plinth::drawer :id="$id" :title="$title" :description="$description">Body</x-plinth::drawer>',
        ['id' => 'a"b', 'title' => '<b>x</b>', 'description' => '<i>y</i>'],
    );

    expect($html)->toContain('&lt;b&gt;x&lt;/b&gt;')
        ->toContain('&lt;i&gt;y&lt;/i&gt;')
        ->toContain('id="a&quot;b"')
        ->not->toContain('<b>x</b>');
});

it('passes extra attributes to its root, and lets a project replace closedby and x-init', function () use ($drawer) {
    $html = $drawer('class="is-busy" closedby="closerequest" wire:ignore.self x-init="ready()" data-testid="route"');

    expect($html)
        ->toStartWith('<dialog id="route" class="plinth-drawer is-busy" data-desktop="dialog" closedby="closerequest" x-init="ready()"')
        ->toContain('wire:ignore.self="" data-testid="route">')
        ->not->toContain('closedby="any"');
});
