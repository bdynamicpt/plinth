<?php

use BDynamic\Plinth\Enums\Size;
use Illuminate\Support\Facades\Blade;

$svg = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>';

it('prints a decorative icon, hidden from assistive technology', function () use ($svg) {
    expect(squish(Blade::render("<x-plinth::icon>{$svg}</x-plinth::icon>")))
        ->toBe('<span class="plinth-icon" data-size="md" aria-hidden="true">'.$svg.'</span>');
});

it('prints a meaningful icon with a label', function () use ($svg) {
    expect(squish(Blade::render("<x-plinth::icon label=\"Warning\">{$svg}</x-plinth::icon>")))
        ->toBe('<span class="plinth-icon" data-size="md" role="img" aria-label="Warning">'.$svg.'</span>');
});

it('takes an aria-label attribute as its label', function () use ($svg) {
    expect(squish(Blade::render("<x-plinth::icon aria-label=\"Warning\">{$svg}</x-plinth::icon>")))
        ->toBe('<span class="plinth-icon" data-size="md" role="img" aria-label="Warning">'.$svg.'</span>');
});

it('stays decorative with a blank label', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon label=\"  \">{$svg}</x-plinth::icon>"))
        ->toContain('aria-hidden="true"')
        ->not->toContain('role="img"');
});

it('takes every size', function (string $size) use ($svg) {
    expect(Blade::render("<x-plinth::icon size=\"{$size}\">{$svg}</x-plinth::icon>"))
        ->toContain("data-size=\"{$size}\"");
})->with(array_column(Size::icons(), 'value'));

it('falls back to md for a size it does not know', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon size=\"huge\">{$svg}</x-plinth::icon>"))
        ->toContain('data-size="md"');
});

it('marks an icon to mirror in right-to-left text', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon mirror>{$svg}</x-plinth::icon>"))->toContain('data-mirror');
    expect(Blade::render("<x-plinth::icon>{$svg}</x-plinth::icon>"))->not->toContain('data-mirror');
});

it('escapes the label', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon :label=\"\$label\">{$svg}</x-plinth::icon>", ['label' => '"><b>x</b>']))
        ->toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"');
});

it('keeps extra classes and attributes, Livewire and Alpine ones included', function () use ($svg) {
    $html = Blade::render("<x-plinth::icon class=\"ms-2\" id=\"extra\" wire:key=\"icon\" x-show=\"open\">{$svg}</x-plinth::icon>");

    expect($html)
        ->toContain('class="plinth-icon ms-2"')
        ->toContain('id="extra"')
        ->toContain('wire:key="icon"')
        ->toContain('x-show="open"');
});

it("lets the project's attribute win over its own", function () use ($svg) {
    expect(Blade::render("<x-plinth::icon aria-hidden=\"false\">{$svg}</x-plinth::icon>"))
        ->toContain('aria-hidden="false"')
        ->not->toContain('aria-hidden="true"');
});
