<?php

use BDynamic\Plinth\Enums\DialogSidePhone;
use Illuminate\Support\Facades\Blade;

$close = '<button class="plinth-button plinth-icon-button plinth-dialog-close" type="button"'
    .' data-variant="ghost" data-size="md" aria-label="Close" commandfor="project" command="close">'
    .'<span class="plinth-icon" data-size="md" aria-hidden="true">'
    .'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 6l12 12M18 6L6 18"></path></svg>'
    .'</span></button>';

it('prints the dialog, the header, the body and the footer', function () use ($close) {
    $html = Blade::render(
        '<x-plinth::dialog id="project" title="Edit project" description="The name shows to everyone.">'
        .'<p>Body</p><x-slot:footer><button type="button">Save</button></x-slot:footer></x-plinth::dialog>'
    );

    expect(squish($html))->toBe(
        '<dialog id="project" class="plinth-dialog" closedby="any"'
        .' aria-labelledby="project-title" aria-describedby="project-description">'
        .'<div class="plinth-dialog-panel">'
        .'<div class="plinth-dialog-header">'
        .'<h2 id="project-title" class="plinth-dialog-title">Edit project</h2>'
        .'<p id="project-description" class="plinth-dialog-description">The name shows to everyone.</p>'
        .$close
        .'</div>'
        .'<div class="plinth-dialog-body"><p>Body</p></div>'
        .'<div class="plinth-dialog-footer"><button type="button">Save</button></div>'
        .'</div>'
        .'</dialog>'
    );
});

it('is an alert dialog with no close button when it is not dismissible', function () {
    $html = squish(Blade::render(
        '<x-plinth::dialog id="leave" title="Leave?" :dismissible="false">Body</x-plinth::dialog>'
    ));

    expect($html)->toBe(
        '<dialog id="leave" class="plinth-dialog" role="alertdialog" closedby="closerequest"'
        .' aria-labelledby="leave-title">'
        .'<div class="plinth-dialog-panel">'
        .'<div class="plinth-dialog-header"><h2 id="leave-title" class="plinth-dialog-title">Leave?</h2></div>'
        .'<div class="plinth-dialog-body">Body</div>'
        .'</div></dialog>'
    );
});

it('has the grab handle and the swipe when it is a bottom sheet on a phone that can be dismissed', function () {
    $dialog = fn (string $props) => Blade::render('<x-plinth::dialog id="project" title="Edit" '.$props.'>Body</x-plinth::dialog>');

    expect(squish($dialog('side-phone="bottom"')))
        ->toContain('<div class="plinth-dialog-panel"><div class="plinth-dialog-handle" aria-hidden="true"></div><div class="plinth-dialog-header">')
        ->toContain('x-init="(('.e('dialog) => {'))
        ->and($dialog('side-phone="bottom" :dismissible="false"'))->not->toContain('plinth-dialog-handle')->not->toContain('x-init')
        ->and($dialog(''))->not->toContain('plinth-dialog-handle')->not->toContain('x-init');
});

it('leaves out an empty or blank description and a missing footer', function () {
    foreach (['', '  '] as $description) {
        $html = squish(Blade::render(
            '<x-plinth::dialog id="project" title="Edit project" :description="$description">Body</x-plinth::dialog>',
            ['description' => $description],
        ));

        expect($html)
            ->not->toContain('aria-describedby')
            ->not->toContain('plinth-dialog-description')
            ->not->toContain('plinth-dialog-footer')
            ->toEndWith('<div class="plinth-dialog-body">Body</div></div></dialog>');
    }
});

it('takes a side on the phone, and falls back to centred, which prints nothing', function () {
    $side = fn (mixed $value) => Blade::render(
        '<x-plinth::dialog id="project" title="Edit project" :side-phone="$value">Body</x-plinth::dialog>',
        ['value' => $value],
    );

    expect($side('bottom'))->toContain('data-side-phone="bottom"')
        ->and($side(DialogSidePhone::Bottom))->toContain('data-side-phone="bottom"')
        ->and($side('center'))->not->toContain('data-side-phone')
        ->and($side('top'))->not->toContain('data-side-phone')
        ->and($side(null))->not->toContain('data-side-phone');
});

it('takes the close button\'s label', function () {
    expect(Blade::render('<x-plinth::dialog id="project" title="Editar" close-label="Fechar">Body</x-plinth::dialog>'))
        ->toContain('aria-label="Fechar"');
});

it('generates an id when it has none, and wires the title to it', function () {
    $html = Blade::render('<x-plinth::dialog title="Edit project">Body</x-plinth::dialog>');

    preg_match('/<dialog id="(plinth-dialog-[a-z0-9]{8})"/', $html, $match);

    expect($match)->toHaveCount(2)
        ->and($html)
        ->toContain('aria-labelledby="'.$match[1].'-title"')
        ->toContain('<h2 id="'.$match[1].'-title"')
        ->toContain('commandfor="'.$match[1].'"');
});

it('needs a title', function () {
    Blade::render('<x-plinth::dialog id="project">Body</x-plinth::dialog>');
})->throws(Exception::class, 'needs a title');

it('escapes the title, the description and the id', function () {
    $html = Blade::render(
        '<x-plinth::dialog :id="$id" :title="$title" :description="$description">Body</x-plinth::dialog>',
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

it('passes extra attributes to its root, and lets a project replace closedby and role', function () {
    $html = Blade::render(
        '<x-plinth::dialog id="project" title="Edit project" :dismissible="false" class="is-busy" closedby="none" role="dialog" wire:key="project" x-ref="dialog" data-testid="project">Body</x-plinth::dialog>'
    );

    expect($html)
        ->toContain('class="plinth-dialog is-busy"')
        ->toContain('closedby="none"')
        ->not->toContain('closedby="closerequest"')
        ->toContain('role="dialog"')
        ->not->toContain('alertdialog')
        ->toContain('wire:key="project"')
        ->toContain('x-ref="dialog"')
        ->toContain('data-testid="project"');
});

it('leaves out a footer slot with nothing in it', function () {
    $html = Blade::render(
        '<x-plinth::dialog id="project" title="Edit project">Body<x-slot:footer>@if ($show) <button type="button">Save</button> @endif <!-- none --></x-slot:footer></x-plinth::dialog>',
        ['show' => false],
    );

    expect($html)->not->toContain('plinth-dialog-footer');
});

it('trims the id it is given', function () {
    expect(Blade::render('<x-plinth::dialog id=" project " title="Edit project">Body</x-plinth::dialog>'))
        ->toContain('<dialog id="project"')
        ->toContain('aria-labelledby="project-title"');
});
