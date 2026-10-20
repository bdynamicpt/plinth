<?php

use BDynamic\Plinth\Enums\ButtonVariant;
use BDynamic\Plinth\Enums\CalloutRole;
use BDynamic\Plinth\Enums\CalloutTone;
use BDynamic\Plinth\Enums\ConfirmDialogKind;
use BDynamic\Plinth\Enums\ConfirmDialogTone;
use BDynamic\Plinth\Enums\DataTableCellKind;
use BDynamic\Plinth\Enums\DataTableSort;
use BDynamic\Plinth\Enums\DialogSidePhone;
use BDynamic\Plinth\Enums\DrawerDesktop;
use BDynamic\Plinth\Enums\DrawerSnap;
use BDynamic\Plinth\Enums\HeadingLevel;
use BDynamic\Plinth\Enums\SheetSide;
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
        ->and(SheetSide::default())->toBe(SheetSide::End)
        ->and(DialogSidePhone::default())->toBe(DialogSidePhone::Center)
        ->and(DrawerDesktop::default())->toBe(DrawerDesktop::Dialog)
        ->and(DataTableSort::default())->toBe(DataTableSort::None)
        ->and(DataTableCellKind::default())->toBe(DataTableCellKind::Field)
        ->and(CalloutTone::default())->toBe(CalloutTone::Neutral)
        ->and(CalloutRole::default())->toBe(CalloutRole::Note)
        ->and(ConfirmDialogKind::default())->toBe(ConfirmDialogKind::Simple)
        ->and(ConfirmDialogTone::default())->toBe(ConfirmDialogTone::Neutral);
});

it('resolves an optional side to a case or nothing', function () {
    expect(SheetSide::resolveOptional(SheetSide::Top))->toBe(SheetSide::Top)
        ->and(SheetSide::resolveOptional('bottom'))->toBe(SheetSide::Bottom)
        ->and(SheetSide::resolveOptional('left'))->toBeNull()
        ->and(SheetSide::resolveOptional(null))->toBeNull();
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
    foreach (SheetSide::values() as $value) {
        expect($vue('sheet.ts'))->toContain("'{$value}'");
    }
    foreach (DialogSidePhone::values() as $value) {
        expect($vue('dialog.ts'))->toContain("'{$value}'");
    }
    foreach ([...DrawerDesktop::values(), ...DrawerSnap::values()] as $value) {
        expect($vue('drawer.ts'))->toContain("'{$value}'");
    }
    foreach ([...CalloutTone::values(), ...CalloutRole::values()] as $value) {
        expect($vue('callout.ts'))->toContain("'{$value}'");
    }
    foreach (CalloutTone::cases() as $tone) {
        // The icon's paths, as Vue writes them in calloutIcons.
        preg_match('/<svg[^>]*>(.*)<\/svg>/', $tone->icon(), $paths);
        expect($vue('callout.ts'))->toContain($paths[1]);
    }
    foreach ([...ConfirmDialogKind::values(), ...ConfirmDialogTone::values()] as $value) {
        expect($vue('confirm-dialog.ts'))->toContain("'{$value}'");
    }
    foreach (ConfirmDialogKind::cases() as $kind) {
        if ($kind->fieldLabel() !== null) {
            expect($vue('confirm-dialog.ts'))->toContain("'{$kind->fieldLabel()}'");
        }
    }
    foreach ([...DataTableSort::values(), ...DataTableCellKind::values()] as $value) {
        expect($vue('data-table.ts'))->toContain("'{$value}'");
    }
});

it('reads a drawer\'s snap points and the one it opens at', function () {
    expect(DrawerSnap::points('full peek'))->toBe([DrawerSnap::Peek, DrawerSnap::Full])
        ->and(DrawerSnap::points([DrawerSnap::Half, 'half', 'top']))->toBe([DrawerSnap::Half])
        ->and(DrawerSnap::points(null))->toBe([])
        ->and(DrawerSnap::opensAt('peek', [DrawerSnap::Peek, DrawerSnap::Half]))->toBe(DrawerSnap::Peek)
        ->and(DrawerSnap::opensAt(null, [DrawerSnap::Peek, DrawerSnap::Half]))->toBe(DrawerSnap::Half)
        ->and(DrawerSnap::opensAt(DrawerSnap::Full, []))->toBeNull();
});
