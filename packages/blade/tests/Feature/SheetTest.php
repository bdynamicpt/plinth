<?php

use BDynamic\Plinth\Enums\SheetPlacement;
use Illuminate\Support\Facades\Blade;

$close = '<button class="plinth-button plinth-icon-button plinth-sheet-close" type="button"'
    .' data-variant="ghost" data-size="md" aria-label="Close" commandfor="filters" command="close">'
    .'<span class="plinth-icon" data-size="md" aria-hidden="true">'
    .'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>'
    .'</span></button>';

it('prints the dialog, the header, the body and the footer', function () use ($close) {
    $html = Blade::render(
        '<x-plinth::sheet id="filters" title="Filters" description="Narrow the list down.">'
        .'<p>Body</p><x-slot:footer><button type="button">Apply</button></x-slot:footer></x-plinth::sheet>'
    );

    expect(squish($html))->toBe(
        '<dialog id="filters" class="plinth-sheet" data-placement="center" closedby="any"'
        .' aria-labelledby="filters-title" aria-describedby="filters-description">'
        .'<div class="plinth-sheet-header">'
        .'<h2 id="filters-title" class="plinth-sheet-title">Filters</h2>'
        .'<p id="filters-description" class="plinth-sheet-description">Narrow the list down.</p>'
        .$close
        .'</div>'
        .'<div class="plinth-sheet-body"><p>Body</p></div>'
        .'<div class="plinth-sheet-footer"><button type="button">Apply</button></div>'
        .'</dialog>'
    );
});

it('leaves out an empty or blank description and a missing footer', function () {
    foreach (['', '  '] as $description) {
        $html = squish(Blade::render(
            '<x-plinth::sheet id="filters" title="Filters" :description="$description">Body</x-plinth::sheet>',
            ['description' => $description],
        ));

        expect($html)
            ->not->toContain('aria-describedby')
            ->not->toContain('plinth-sheet-description')
            ->not->toContain('plinth-sheet-footer')
            ->toEndWith('<div class="plinth-sheet-body">Body</div></dialog>');
    }
});

it('takes a placement, and falls back to center', function () {
    $placement = fn (mixed $value) => Blade::render(
        '<x-plinth::sheet id="filters" title="Filters" :placement="$value">Body</x-plinth::sheet>',
        ['value' => $value],
    );

    expect($placement('end'))->toContain('data-placement="end"')
        ->and($placement(SheetPlacement::End))->toContain('data-placement="end"')
        ->and($placement('start'))->toContain('data-placement="center"')
        ->and($placement(null))->toContain('data-placement="center"');
});

it('takes the close button\'s label', function () {
    expect(Blade::render('<x-plinth::sheet id="filters" title="Filtros" close-label="Fechar">Body</x-plinth::sheet>'))
        ->toContain('aria-label="Fechar"');
});

it('generates an id when it has none, and wires the title to it', function () {
    $html = Blade::render('<x-plinth::sheet title="Filters">Body</x-plinth::sheet>');

    preg_match('/<dialog id="(plinth-sheet-[a-z0-9]{8})"/', $html, $match);

    expect($match)->toHaveCount(2)
        ->and($html)
        ->toContain('aria-labelledby="'.$match[1].'-title"')
        ->toContain('<h2 id="'.$match[1].'-title"')
        ->toContain('commandfor="'.$match[1].'"');
});

it('needs a title', function () {
    Blade::render('<x-plinth::sheet id="filters">Body</x-plinth::sheet>');
})->throws(Exception::class, 'needs a title');

it('escapes the title, the description and the id', function () {
    $html = Blade::render(
        '<x-plinth::sheet :id="$id" :title="$title" :description="$description">Body</x-plinth::sheet>',
        ['id' => 'a"b', 'title' => '<b>x</b>', 'description' => '<i>y</i>'],
    );

    expect($html)
        ->not->toContain('<b>')
        ->not->toContain('<i>')
        ->not->toContain('a"b')
        ->toContain('&lt;b&gt;x&lt;/b&gt;')
        ->toContain('&lt;i&gt;y&lt;/i&gt;')
        ->toContain('id="a&quot;b"');
});

it('passes extra attributes to its root, and lets a project replace closedby', function () {
    $html = Blade::render(
        '<x-plinth::sheet id="filters" title="Filters" class="is-busy" closedby="closerequest" wire:key="filters" x-ref="sheet" data-testid="filters">Body</x-plinth::sheet>'
    );

    expect($html)
        ->toContain('class="plinth-sheet is-busy"')
        ->toContain('closedby="closerequest"')
        ->not->toContain('closedby="any"')
        ->toContain('wire:key="filters"')
        ->toContain('x-ref="sheet"')
        ->toContain('data-testid="filters"');
});
