<?php

use BDynamic\Plinth\Enums\ButtonVariant;
use BDynamic\Plinth\Enums\Size;
use Illuminate\Support\Facades\Blade;

$svg = '<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>';

it('prints the icon button markup contract', function () use ($svg) {
    expect(squish(Blade::render("<x-plinth::icon-button label=\"Close\">{$svg}</x-plinth::icon-button>")))
        ->toBe('<button class="plinth-button plinth-icon-button" type="button" data-variant="ghost" data-size="md" aria-label="Close"><span class="plinth-icon" data-size="md" aria-hidden="true">'.$svg.'</span></button>');
});

it('refuses to render without a label', function () use ($svg) {
    Blade::render("<x-plinth::icon-button>{$svg}</x-plinth::icon-button>");
})->throws(Exception::class, 'needs a label');

it('takes an aria-label attribute as its label', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon-button aria-label=\"Close\">{$svg}</x-plinth::icon-button>"))
        ->toContain('aria-label="Close"');
});

it('takes an aria-label attribute when the label is blank', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon-button label=\"\" aria-label=\"Next\">{$svg}</x-plinth::icon-button>"))
        ->toContain('aria-label="Next"');
});

it('takes every variant and size, with icons sized to it', function (string $variant, string $size) use ($svg) {
    $html = Blade::render("<x-plinth::icon-button label=\"Go\" variant=\"{$variant}\" size=\"{$size}\">{$svg}</x-plinth::icon-button>");

    expect($html)
        ->toContain("data-variant=\"{$variant}\"")
        ->toContain("data-size=\"{$size}\"")
        ->toContain('class="plinth-icon" data-size="'.($size === 'sm' ? 'sm' : 'md').'"');
})->with(ButtonVariant::values())->with(array_column(Size::controls(), 'value'));

it('is a toggle when pressed is set, and not otherwise', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon-button label=\"Favourite\" :pressed=\"true\">{$svg}</x-plinth::icon-button>"))->toContain('aria-pressed="true"');
    expect(Blade::render("<x-plinth::icon-button label=\"Favourite\" :pressed=\"false\">{$svg}</x-plinth::icon-button>"))->toContain('aria-pressed="false"');
    expect(Blade::render("<x-plinth::icon-button label=\"Favourite\">{$svg}</x-plinth::icon-button>"))->not->toContain('aria-pressed');
});

it('disables, shows busy and flips like the button', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon-button label=\"Close\" disabled>{$svg}</x-plinth::icon-button>"))->toContain('disabled=""');
    expect(Blade::render("<x-plinth::icon-button label=\"Close\" busy>{$svg}</x-plinth::icon-button>"))
        ->toContain('aria-busy="true"')
        ->toContain('plinth-button-spinner')
        ->not->toContain('plinth-icon"');
    expect(Blade::render("<x-plinth::icon-button label=\"Next\" mirror>{$svg}</x-plinth::icon-button>"))->toContain('data-mirror');
});

it('is a link with an href', function () use ($svg) {
    expect(Blade::render("<x-plinth::icon-button label=\"Next page\" href=\"/page/2\">{$svg}</x-plinth::icon-button>"))
        ->toStartWith('<a ')
        ->toContain('href="/page/2"')
        ->not->toContain('type="button"');
    expect(Blade::render("<x-plinth::icon-button label=\"Next page\" href=\"/page/2\" :pressed=\"true\">{$svg}</x-plinth::icon-button>"))
        ->not->toContain('aria-pressed');
});

it('escapes the label and passes Livewire and Alpine attributes to its root', function () use ($svg) {
    $html = Blade::render("<x-plinth::icon-button :label=\"\$label\" class=\"ms-2\" wire:click=\"close\" x-on:click=\"open = false\">{$svg}</x-plinth::icon-button>", ['label' => '"><b>x</b>']);

    expect($html)
        ->toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"')
        ->toContain('class="plinth-button plinth-icon-button ms-2"')
        ->toContain('wire:click="close"')
        ->toContain('x-on:click="open = false"');
});

it("lets the project's attribute win over its own, on a button and a link", function () use ($svg) {
    expect(Blade::render("<x-plinth::icon-button label=\"Bold\" :pressed=\"false\" aria-pressed=\"mixed\">{$svg}</x-plinth::icon-button>"))
        ->toContain('aria-pressed="mixed"')
        ->not->toContain('aria-pressed="false"');
    expect(Blade::render("<x-plinth::icon-button label=\"Next\" href=\"/next\" disabled role=\"button\">{$svg}</x-plinth::icon-button>"))
        ->toContain('role="button"')
        ->not->toContain('role="link"');
});
