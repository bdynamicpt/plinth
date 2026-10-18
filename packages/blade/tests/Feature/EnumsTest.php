<?php

use BDynamic\Plinth\Enums\ButtonSize;
use BDynamic\Plinth\Enums\ButtonVariant;
use BDynamic\Plinth\Enums\IconSize;
use BDynamic\Plinth\Enums\Tone;
use Illuminate\Support\Facades\Blade;

it('resolves a case, its value, or nothing to a case', function () {
    expect(ButtonVariant::resolve(ButtonVariant::Danger))->toBe(ButtonVariant::Danger)
        ->and(ButtonVariant::resolve('danger-ghost'))->toBe(ButtonVariant::DangerGhost)
        ->and(ButtonVariant::resolve(null))->toBe(ButtonVariant::Primary)
        ->and(ButtonVariant::resolve('loud'))->toBe(ButtonVariant::Primary);
});

it('defaults each choice the way the components do', function () {
    expect(Tone::default())->toBe(Tone::Neutral)
        ->and(IconSize::default())->toBe(IconSize::Md)
        ->and(ButtonVariant::default())->toBe(ButtonVariant::Primary)
        ->and(ButtonSize::default())->toBe(ButtonSize::Md);
});

it('sizes a button\'s icons to the button', function () {
    expect(ButtonSize::Sm->iconSize())->toBe(IconSize::Sm)
        ->and(ButtonSize::Md->iconSize())->toBe(IconSize::Md)
        ->and(ButtonSize::Lg->iconSize())->toBe(IconSize::Md);
});

it('lets a view pass the enum instead of a string', function () {
    $html = Blade::render(
        '<x-plinth::button :variant="$variant" :size="$size">Delete</x-plinth::button><x-plinth::badge :tone="$tone">Paid</x-plinth::badge>',
        ['variant' => ButtonVariant::Danger, 'size' => ButtonSize::Sm, 'tone' => Tone::Success],
    );

    expect($html)
        ->toContain('data-variant="danger"')
        ->toContain('data-size="sm"')
        ->toContain('data-tone="success"');
});

it('matches the lists the Vue layer and the stories use', function () {
    $vue = fn (string $file) => file_get_contents(dirname(__DIR__, 3).'/vue/src/'.$file);

    foreach (ButtonVariant::values() as $value) {
        expect($vue('button.ts'))->toContain("'{$value}'");
    }
    foreach (Tone::values() as $value) {
        expect($vue('tones.ts'))->toContain("'{$value}'");
    }
    foreach (IconSize::values() as $value) {
        expect($vue('icon.ts'))->toContain("'{$value}'");
    }
});
