<?php

namespace BDynamic\Plinth;

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;

final class PlinthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Blade::anonymousComponentPath(__DIR__.'/../resources/views/components', 'plinth');

        $this->publishes([
            Plinth::cssPath() => public_path('vendor/plinth/plinth.css'),
            Plinth::fontsPath() => public_path('vendor/plinth/fonts'),
        ], 'plinth-assets');
    }
}
