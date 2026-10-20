<?php

use App\Components\Catalogue;
use App\Components\Component;
use App\Components\Playground;

it('lists the components by group, in the groups\' order', function () {
    $catalogue = app(Catalogue::class);

    expect($catalogue->groups()->keys()->all())->toBe(['Actions', 'Content', 'Navigation', 'Overlays'])
        ->and($catalogue->all()->first()?->slug)->toBe('button')
        ->and($catalogue->all())->toHaveCount(17);
});

it('finds a component, and the one before and after it', function () {
    $catalogue = app(Catalogue::class);
    $button = $catalogue->find('button');
    $sheet = $catalogue->find('sheet');

    expect($button)->toBeInstanceOf(Component::class)
        ->and($catalogue->find('nope'))->toBeNull()
        ->and($button === null ? null : $catalogue->previous($button))->toBeNull()
        ->and($button === null ? null : $catalogue->next($button)?->slug)->toBe('icon-button')
        ->and($sheet === null ? null : $catalogue->next($sheet))->toBeNull();
});

it('knows its files, its stories, its layers and its playground', function () {
    $iconButton = app(Catalogue::class)->find('icon-button');
    $header = app(Catalogue::class)->find('header');

    expect($iconButton?->files)->toBe([
        'packages/css/src/components/button.css',
        'packages/blade/resources/views/components/icon-button.blade.php',
        'packages/vue/src/PlinthIconButton.vue',
        'packages/react/src/PlinthIconButton.tsx',
    ])
        ->and($iconButton?->url())->toBe('/components/icon-button')
        ->and($iconButton?->stories())->toBe('/storybook/?path=/docs/components-icon-button--docs')
        ->and($iconButton?->layers())->toBe(['HTML', 'Blade', 'Vue', 'React'])
        ->and($iconButton?->playground)->toBeInstanceOf(Playground::class)
        ->and($header?->layers())->toBe(['HTML', 'Blade', 'Vue', 'React'])
        ->and($header?->files)->toContain('packages/react/src/PlinthHeader.tsx')
        ->and($header?->playground)->toBeNull();
});
