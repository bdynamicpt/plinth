<?php

use App\BrandSwitcher;

it('writes nothing to override for Plinth\'s own brand colour and corners', function () {
    $switcher = new BrandSwitcher;

    expect($switcher->declarations('blue', 'plinth'))->toBe([])
        ->and($switcher->style('blue', 'plinth'))->toBe('')
        ->and($switcher->css('blue', 'plinth'))->toBe("/* Plinth's defaults: nothing to override. */");
});

it('gives every colour it overrides a light and a dark value', function () {
    $switcher = new BrandSwitcher;

    foreach (array_keys(BrandSwitcher::ACCENTS) as $accent) {
        foreach (array_keys(BrandSwitcher::CORNERS) as $corners) {
            foreach ($switcher->declarations($accent, $corners) as $property => $value) {
                if (str_starts_with($property, '--plinth-color-')) {
                    expect($value)->toMatch('/^light-dark\(oklch\([^)]+\), oklch\([^)]+\)\)$/');
                }
            }
        }
    }
});

it('writes the CSS a project would add, and the same declarations as the preview\'s style', function () {
    $switcher = new BrandSwitcher;

    expect($switcher->css('teal', 'sharp'))->toBe(<<<'CSS'
        /* After Plinth's CSS: each colour for light and dark. */
        :root {
          --plinth-color-accent: light-dark(oklch(0.52 0.1 185), oklch(0.76 0.12 180));
          --plinth-color-accent-hover: light-dark(oklch(0.47 0.09 185), oklch(0.81 0.1 180));
          --plinth-color-accent-active: light-dark(oklch(0.42 0.08 185), oklch(0.86 0.08 180));
          --plinth-color-accent-text: light-dark(oklch(0.45 0.09 185), oklch(0.82 0.1 180));
          --plinth-color-accent-subtle: light-dark(oklch(0.95 0.03 185), oklch(0.3 0.05 185));
          --plinth-color-accent-subtle-hover: light-dark(oklch(0.92 0.04 185), oklch(0.35 0.06 185));
          --plinth-color-accent-subtle-active: light-dark(oklch(0.89 0.05 185), oklch(0.39 0.07 185));
          --plinth-color-on-accent: light-dark(oklch(0.99 0 0), oklch(0.2 0.03 185));
          --plinth-color-focus-ring: light-dark(oklch(0.52 0.1 185), oklch(0.82 0.1 180));
          --plinth-radius-control: 0.125rem;
          --plinth-radius-container: 0.25rem;
          --plinth-radius-pill: 0.25rem;
        }
        CSS)
        ->and($switcher->css('blue', 'round'))->toBe("/* After Plinth's CSS: each colour for light and dark. */\n:root {\n  --plinth-radius-control: 0.75rem;\n  --plinth-radius-container: 1.25rem;\n}")
        ->and($switcher->style('blue', 'round'))->toBe('--plinth-radius-control: 0.75rem; --plinth-radius-container: 1.25rem;');
});

it('lists every pair for the switcher, and a swatch for each brand colour', function () {
    $switcher = new BrandSwitcher;

    expect($switcher->pairs())->toHaveCount(12)
        ->toHaveKey('violet round')
        ->and($switcher->pairs()['ember plinth']['style'])->toContain('--plinth-color-accent: light-dark(oklch(0.52 0.16 42), oklch(0.75 0.15 52));')
        ->and($switcher->swatches())->toBe([
            'blue' => 'var(--plinth-color-accent)',
            'teal' => 'light-dark(oklch(0.52 0.1 185), oklch(0.76 0.12 180))',
            'ember' => 'light-dark(oklch(0.52 0.16 42), oklch(0.75 0.15 52))',
            'violet' => 'light-dark(oklch(0.52 0.2 295), oklch(0.73 0.15 295))',
        ]);
});
