<?php

use Tests\TestCase;

pest()->extend(TestCase::class)->in('Feature');

/** A small tokens.json, in the shape the tokens build writes it. */
function fixtureTokens(): string
{
    $file = sys_get_temp_dir().'/plinth-site-tokens.json';

    file_put_contents($file, json_encode([
        ['path' => ['ref', 'space', '1'], 'name' => '--plinth-ref-space-1', 'tier' => 'primitive', 'type' => 'dimension', 'value' => '0.25rem'],
        ['path' => ['color', 'surface'], 'name' => '--plinth-color-surface', 'tier' => 'semantic', 'type' => 'color', 'value' => 'oklch(0.985 0.002 260)', 'dark' => 'oklch(0.18 0.005 260)', 'ref' => 'ref.color.neutral.50', 'darkRef' => 'ref.color.neutral.950'],
        ['path' => ['space', '1'], 'name' => '--plinth-space-1', 'tier' => 'semantic', 'type' => 'dimension', 'value' => '0.25rem', 'ref' => 'ref.space.1'],
        ['path' => ['font', 'family', 'body'], 'name' => '--plinth-font-family-body', 'tier' => 'semantic', 'type' => 'fontFamily', 'value' => 'Geist'],
        ['path' => ['header', 'height'], 'name' => '--plinth-header-height', 'tier' => 'component', 'type' => 'dimension', 'value' => '3.5rem', 'ref' => 'space.14', 'description' => 'The header\'s height.'],
        'not a token',
    ]));

    return $file;
}
