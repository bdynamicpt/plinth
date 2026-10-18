<?php

/**
 * Renders Plinth's Blade components for the parity tests in storybook/.
 *
 * Reads a JSON list of cases from stdin, each {"component": "badge", "props": {...},
 * "attributes": {...}, "slot": "..."}, and writes the rendered HTML of each, as a JSON list, to
 * stdout. Props are passed as PHP values (`:tone="$props['tone']"`), so booleans and arrays arrive
 * as they would from a view. Attributes are written as plain ones (`id="status"`), the way a
 * project writes `class`, `wire:click` or `x-on:click` on the component.
 */

use BDynamic\Plinth\PlinthServiceProvider;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Str;
use Orchestra\Testbench\Foundation\Application;

require __DIR__.'/../vendor/autoload.php';

Application::create(resolvingCallback: function ($app) {
    $app->register(PlinthServiceProvider::class);
});

$cases = json_decode(stream_get_contents(STDIN), true, flags: JSON_THROW_ON_ERROR);

$rendered = array_map(function (array $case): string {
    $props = $case['props'] ?? [];
    $bindings = collect(array_keys($props))
        ->map(fn (string $name) => sprintf(':%s="$props[%s]"', Str::kebab($name), var_export($name, true)))
        ->implode(' ');
    $bindings .= collect($case['attributes'] ?? [])
        ->map(fn (string $value, string $name) => sprintf(' %s="%s"', $name, e($value)))
        ->implode('');
    $template = sprintf('<x-plinth::%s %s>{!! $slot !!}</x-plinth::%1$s>', $case['component'], $bindings);

    return Blade::render($template, ['props' => $props, 'slot' => $case['slot'] ?? '']);
}, $cases);

echo json_encode($rendered, JSON_THROW_ON_ERROR | JSON_UNESCAPED_SLASHES);
