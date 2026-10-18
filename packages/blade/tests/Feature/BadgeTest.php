<?php

use Illuminate\Support\Facades\Blade;

it('prints the badge markup contract', function () {
    expect(squish(Blade::render('<x-plinth::badge tone="success" dot>Paid</x-plinth::badge>')))
        ->toBe('<span class="plinth-badge" data-tone="success"><span class="plinth-badge-dot" aria-hidden="true"></span><span class="plinth-badge-label">Paid</span></span>');
});

it('is neutral and has no dot by default', function () {
    expect(squish(Blade::render('<x-plinth::badge>Draft</x-plinth::badge>')))
        ->toBe('<span class="plinth-badge" data-tone="neutral"><span class="plinth-badge-label">Draft</span></span>');
});

it('falls back to neutral for a tone it does not know', function () {
    expect(Blade::render('<x-plinth::badge tone="purple">Draft</x-plinth::badge>'))
        ->toContain('data-tone="neutral"');
});

it('escapes the label', function () {
    expect(Blade::render('<x-plinth::badge>{{ $label }}</x-plinth::badge>', ['label' => '<b>x</b>']))
        ->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('keeps extra classes and attributes', function () {
    $html = Blade::render('<x-plinth::badge tone="danger" class="ms-2" id="status">Overdue</x-plinth::badge>');

    expect($html)
        ->toContain('class="plinth-badge ms-2"')
        ->toContain('id="status"')
        ->toContain('data-tone="danger"');
});
