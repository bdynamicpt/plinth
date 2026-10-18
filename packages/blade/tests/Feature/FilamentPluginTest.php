<?php

use BDynamic\Plinth\Filament\PlinthPlugin;
use BDynamic\Plinth\Plinth;
use Filament\Panel;
use Filament\Support\Assets\Css;
use Filament\Support\Facades\FilamentAsset;

it('ships the built CSS', function () {
    expect(Plinth::cssPath())->toBeFile()
        ->and(file_get_contents(Plinth::cssPath()))
        ->toContain('--plinth-color-text')
        ->toContain('.plinth-badge');
});

it('registers the built CSS with Filament\'s asset manager', function () {
    $panel = Panel::make()->id('test')->plugin(PlinthPlugin::make());

    $panel->registerAssets();

    $styles = FilamentAsset::getStyles([PlinthPlugin::PACKAGE]);

    expect($styles)->toHaveCount(1)
        ->and($styles[0])->toBeInstanceOf(Css::class)
        ->and($styles[0]->getId())->toBe('plinth')
        ->and($styles[0]->getPath())->toBe(Plinth::cssPath())
        ->and($panel->getPlugin('plinth'))->toBeInstanceOf(PlinthPlugin::class);
});
