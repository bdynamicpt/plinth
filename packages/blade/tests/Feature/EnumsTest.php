<?php

use BDynamic\Plinth\Enums\ButtonVariant;
use BDynamic\Plinth\Enums\HeadingLevel;
use BDynamic\Plinth\Enums\SheetPlacement;
use BDynamic\Plinth\Enums\Size;
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
        ->and(ButtonVariant::default())->toBe(ButtonVariant::Primary)
        ->and(Size::default())->toBe(Size::Medium)
        ->and(HeadingLevel::default())->toBe(HeadingLevel::Two)
        ->and(SheetPlacement::default())->toBe(SheetPlacement::Center);
});

it('sizes a control\'s icons to the control', function () {
    expect(Size::Small->iconSize())->toBe(Size::Small)
        ->and(Size::Medium->iconSize())->toBe(Size::Medium)
        ->and(Size::Large->iconSize())->toBe(Size::Medium);
});

it('resolves a size among the ones a component supports', function () {
    expect(Size::resolve('lg', Size::controls()))->toBe(Size::Large)
        ->and(Size::resolve('xl', Size::controls()))->toBe(Size::Medium)
        ->and(Size::resolve(Size::ExtraLarge))->toBe(Size::ExtraLarge)
        ->and(Size::resolve('huge', Size::controls(), Size::Small))->toBe(Size::Small);
});

it('lets a view pass the enum instead of a string', function () {
    $html = Blade::render(
        '<x-plinth::button :variant="$variant" :size="$size">Delete</x-plinth::button><x-plinth::badge :tone="$tone">Paid</x-plinth::badge>',
        ['variant' => ButtonVariant::Danger, 'size' => Size::Small, 'tone' => Tone::Success],
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
    foreach (Size::values() as $value) {
        expect($vue('size.ts'))->toContain("'{$value}'");
    }
    foreach (HeadingLevel::values() as $value) {
        expect($vue('heading.ts'))->toContain("'{$value}'");
    }
    foreach (SheetPlacement::values() as $value) {
        expect($vue('sheet.ts'))->toContain("'{$value}'");
    }
});
