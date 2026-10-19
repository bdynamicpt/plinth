<?php

use App\Components\Playground;

function playground(): Playground
{
    return new Playground(
        '<x-plinth::badge{attributes}>{label}</x-plinth::badge>',
        [
            'tone' => ['values' => ['neutral', 'success'], 'default' => 'neutral', 'content' => ['neutral' => ['{label}' => 'Draft'], 'success' => ['{label}' => 'Paid']]],
            'status' => ['values' => ['none', 'on'], 'default' => 'none', 'print' => ['on' => 'status="on" status-label="Online"']],
        ],
        ['dot'],
    );
}

it('reads the choices from the query string, and the default for anything it doesn\'t know', function () {
    expect(playground()->values(['tone' => 'success', 'dot' => '1']))->toBe(['tone' => 'success', 'status' => 'none', 'dot' => true])
        ->and(playground()->values(['tone' => 'pink', 'status' => ['on'], 'dot' => 'yes']))->toBe(['tone' => 'neutral', 'status' => 'none', 'dot' => false]);
});

it('links each choice, leaving out the defaults', function () {
    $values = playground()->values([]);

    expect(playground()->link($values, 'tone', 'success'))->toBe('?tone=success#playground')
        ->and(playground()->link($values, 'tone', 'neutral'))->toBe('?#playground')
        ->and(playground()->link($values, 'dot'))->toBe('?dot=1#playground')
        ->and(playground()->link(['tone' => 'success', 'status' => 'none', 'dot' => true], 'dot'))->toBe('?tone=success#playground');
});

it('makes the Blade for the choices', function () {
    expect(playground()->blade(playground()->values([])))->toBe('<x-plinth::badge>Draft</x-plinth::badge>')
        ->and(playground()->blade(['tone' => 'success', 'status' => 'on', 'dot' => true]))
        ->toBe('<x-plinth::badge tone="success" status="on" status-label="Online" dot>Paid</x-plinth::badge>');
});
