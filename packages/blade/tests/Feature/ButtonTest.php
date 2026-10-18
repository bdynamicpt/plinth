<?php

use BDynamic\Plinth\Enums\ButtonSize;
use BDynamic\Plinth\Enums\ButtonVariant;
use Illuminate\Support\Facades\Blade;

$svg = '<svg viewBox="0 0 24 24"><path d="M5 12l5 5L19 7"/></svg>';

it('prints the button markup contract', function () {
    expect(squish(Blade::render('<x-plinth::button>Save</x-plinth::button>')))
        ->toBe('<button class="plinth-button" type="button" data-variant="primary" data-size="md"><span class="plinth-button-label">Save</span></button>');
});

it('prints a link when given an href', function () {
    expect(squish(Blade::render('<x-plinth::button href="/orders" variant="secondary">Orders</x-plinth::button>')))
        ->toBe('<a class="plinth-button" href="/orders" data-variant="secondary" data-size="md"><span class="plinth-button-label">Orders</span></a>');
});

it('takes every variant and size', function (string $variant, string $size) {
    expect(Blade::render("<x-plinth::button variant=\"{$variant}\" size=\"{$size}\">Go</x-plinth::button>"))
        ->toContain("data-variant=\"{$variant}\"")
        ->toContain("data-size=\"{$size}\"");
})->with(ButtonVariant::values())->with(ButtonSize::values());

it('falls back to primary and md for values it does not know', function () {
    expect(Blade::render('<x-plinth::button variant="loud" size="huge">Go</x-plinth::button>'))
        ->toContain('data-variant="primary"')
        ->toContain('data-size="md"');
});

it('prints the leading and trailing icons, sized to the button', function () use ($svg) {
    $html = squish(Blade::render(<<<BLADE
        <x-plinth::button size="sm">
            <x-slot:icon>{$svg}</x-slot:icon>
            Next
            <x-slot:trailing>{$svg}</x-slot:trailing>
        </x-plinth::button>
        BLADE));

    expect($html)->toBe('<button class="plinth-button" type="button" data-variant="primary" data-size="sm"><span class="plinth-icon" data-size="sm" aria-hidden="true">'.$svg.'</span><span class="plinth-button-label">Next</span><span class="plinth-icon" data-size="sm" aria-hidden="true">'.$svg.'</span></button>');
});

it('flips arrow icons in right-to-left text when asked', function () use ($svg) {
    $html = Blade::render(<<<BLADE
        <x-plinth::button mirror-trailing>
            Next
            <x-slot:trailing>{$svg}</x-slot:trailing>
        </x-plinth::button>
        BLADE);

    expect($html)->toContain('data-mirror');
});

it('disables a button with disabled, and a link with aria-disabled and no href', function () {
    expect(Blade::render('<x-plinth::button disabled>Save</x-plinth::button>'))->toContain('disabled=""');

    $link = Blade::render('<x-plinth::button href="/orders" disabled>Orders</x-plinth::button>');
    expect($link)
        ->toContain('role="link"')
        ->toContain('aria-disabled="true"')
        ->not->toContain('href=');
});

it('shows a spinner and stays focusable while busy', function () use ($svg) {
    $html = Blade::render(<<<BLADE
        <x-plinth::button busy>
            <x-slot:icon>{$svg}</x-slot:icon>
            Saving
        </x-plinth::button>
        BLADE);

    expect($html)
        ->toContain('aria-busy="true"')
        ->toContain('aria-disabled="true"')
        ->toContain('<span class="plinth-button-spinner" aria-hidden="true"></span>')
        ->not->toContain('plinth-icon')
        ->not->toContain('disabled=""');
});

it('lets disabled win over busy', function () {
    expect(Blade::render('<x-plinth::button disabled busy>Save</x-plinth::button>'))
        ->toContain('disabled=""')
        ->not->toContain('aria-busy');
});

it('escapes the label', function () {
    expect(Blade::render('<x-plinth::button>{{ $label }}</x-plinth::button>', ['label' => '<b>x</b>']))
        ->toContain('&lt;b&gt;x&lt;/b&gt;');
});

it('passes classes, a type and Livewire and Alpine attributes to its root', function () {
    $html = Blade::render('<x-plinth::button class="ms-2" type="submit" wire:click="save" x-on:click="open = false">Save</x-plinth::button>');

    expect($html)
        ->toContain('class="plinth-button ms-2"')
        ->toContain('type="submit"')
        ->not->toContain('type="button"')
        ->toContain('wire:click="save"')
        ->toContain('x-on:click="open = false"');
});
