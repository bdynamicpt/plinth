<?php

use BDynamic\Plinth\Enums\Size;
use BDynamic\Plinth\Support\Initials;
use Illuminate\Support\Facades\Blade;

it('prints initials with the name as the accessible name', function () {
    expect(squish(Blade::render('<x-plinth::avatar name="Ana Lima" />')))
        ->toBe('<span class="plinth-avatar" data-size="md" role="img" aria-label="Ana Lima"><span class="plinth-avatar-initials" aria-hidden="true">AL</span></span>');
});

it('prints an image when there is one', function () {
    expect(Blade::render('<x-plinth::avatar name="Ana Lima" src="/ana.jpg" />'))
        ->toContain('<img class="plinth-avatar-image" src="/ana.jpg" alt="">')
        ->not->toContain('plinth-avatar-initials');
});

it('takes initials from the first and last word', function (string $name, string $initials) {
    expect(Initials::from($name))->toBe($initials);
})->with([
    ['Ana Lima', 'AL'],
    ['Ana Maria de Lima', 'AL'],
    ['Zé', 'Z'],
    ['  élio   ramos ', 'ÉR'],
    ['', ''],
]);

it('prefers given initials, and shows the glyph when there are none', function () {
    expect(Blade::render('<x-plinth::avatar name="Plinth Design" initials="PD" />'))->toContain('>PD<');
    expect(Blade::render('<x-plinth::avatar decorative />'))->toContain('class="plinth-avatar-glyph"');
});

it('refuses to render without a name unless decorative', function () {
    Blade::render('<x-plinth::avatar />');
})->throws(Exception::class, 'needs a name');

it('is hidden from assistive technology when decorative', function () {
    $html = Blade::render('<x-plinth::avatar name="Ana Lima" decorative />');

    expect($html)->toContain('aria-hidden="true"')->not->toContain('role="img"')->not->toContain('aria-label');
});

it('adds the status dot, and its label to the name', function () {
    $html = Blade::render('<x-plinth::avatar name="Ana Lima" status="success" status-label="Online" />');

    expect($html)
        ->toContain('aria-label="Ana Lima, Online"')
        ->toContain('<span class="plinth-avatar-status" data-tone="success" aria-hidden="true"></span>');
});

it('refuses a status without a label, unless decorative', function () {
    Blade::render('<x-plinth::avatar name="Ana Lima" status="success" />');
})->throws(Exception::class, 'needs a status-label');

it('accepts a status without a label when decorative', function () {
    expect(Blade::render('<x-plinth::avatar name="Ana Lima" status="success" decorative />'))
        ->toContain('data-tone="success"');
});

it('takes every tone, falls back to neutral, and treats an empty status as none', function () {
    foreach (['neutral', 'success', 'warning', 'danger'] as $tone) {
        expect(Blade::render("<x-plinth::avatar name=\"Ana\" status=\"{$tone}\" status-label=\"x\" />"))
            ->toContain("data-tone=\"{$tone}\"");
    }
    expect(Blade::render('<x-plinth::avatar name="Ana" status="purple" status-label="x" />'))->toContain('data-tone="neutral"');
    expect(Blade::render('<x-plinth::avatar name="Ana" status="" />'))->not->toContain('plinth-avatar-status');
});

it('takes every avatar size and falls back to md', function (string $size) {
    expect(Blade::render("<x-plinth::avatar name=\"Ana Lima\" size=\"{$size}\" />"))->toContain("data-size=\"{$size}\"");
})->with(array_column(Size::avatars(), 'value'));

it('falls back to md for a size it does not support', function () {
    expect(Blade::render('<x-plinth::avatar name="Ana Lima" size="xs" />'))->toContain('data-size="md"');
});

it('escapes the name and passes extra attributes to its root', function () {
    $html = Blade::render('<x-plinth::avatar :name="$name" class="ms-2" wire:key="avatar" />', ['name' => '"><b>x</b>']);

    expect($html)
        ->toContain('aria-label="&quot;&gt;&lt;b&gt;x&lt;/b&gt;"')
        ->toContain('class="plinth-avatar ms-2"')
        ->toContain('wire:key="avatar"');
});
