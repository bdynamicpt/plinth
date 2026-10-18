<?php

use Illuminate\Support\Facades\Blade;

it('prints the avatar markup contract', function () {
    expect(squish(Blade::render('<x-plinth::avatar>Content</x-plinth::avatar>')))
        ->toBe('<div class="plinth-avatar">Content</div>');
});

it('escapes the content', function () {
    expect(Blade::render('<x-plinth::avatar>{{ $label }}</x-plinth::avatar>', ['label' => '<b>x</b>']))
        ->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('keeps extra classes and attributes', function () {
    $html = Blade::render('<x-plinth::avatar class="ms-2" id="extra">Content</x-plinth::avatar>');

    expect($html)
        ->toContain('class="plinth-avatar ms-2"')
        ->toContain('id="extra"');
});
