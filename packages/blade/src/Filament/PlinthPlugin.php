<?php

namespace BDynamic\Plinth\Filament;

use BDynamic\Plinth\Plinth;
use Filament\Contracts\Plugin;
use Filament\Panel;
use Filament\Support\Assets\Css;

/**
 * Registers Plinth's built CSS with Filament's asset manager, so a panel needs no Node build:
 *
 *     $panel->plugin(PlinthPlugin::make());
 *
 * Then run `php artisan filament:assets` (Filament runs it on `composer update`) to publish it.
 */
class PlinthPlugin implements Plugin
{
    public const PACKAGE = 'bdynamicpt/plinth';

    public static function make(): static
    {
        return app(static::class);
    }

    public function getId(): string
    {
        return 'plinth';
    }

    public function register(Panel $panel): void
    {
        $panel->assets([
            Css::make('plinth', Plinth::cssPath()),
        ], self::PACKAGE);
    }

    public function boot(Panel $panel): void {}
}
