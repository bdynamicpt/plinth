<?php

use BDynamic\Plinth\Enums\ConfirmDialogKind;
use BDynamic\Plinth\Enums\ConfirmDialogTone;
use BDynamic\Plinth\Enums\DialogSidePhone;
use Illuminate\Support\Facades\Blade;

$cancel = '<button class="plinth-button" type="button" data-variant="secondary" data-size="md"'
    .' commandfor="archive" command="close" value="cancel"><span class="plinth-button-label">Cancel</span></button>';

$confirm = fn (string $variant = 'primary', string $label = 'Archive') => '<button class="plinth-button plinth-confirm-dialog-confirm" type="submit"'
    .' data-variant="'.$variant.'" data-size="md" value="confirm"><span class="plinth-button-label">'.$label.'</span></button>';

$render = fn (string $props = '', array $data = []) => squish(Blade::render(
    '<x-plinth::confirm-dialog id="archive" title="Archive 3 tickets?" message="You can bring them back." confirm-label="Archive" '.$props.' />',
    $data,
));

it('prints the simple kind: the question, the message, Cancel and the action', function () use ($render, $cancel, $confirm) {
    expect($render())->toBe(
        '<dialog id="archive" class="plinth-dialog plinth-confirm-dialog" role="alertdialog" closedby="closerequest"'
        .' aria-labelledby="archive-title" aria-describedby="archive-message">'
        .'<form method="dialog" class="plinth-confirm-dialog-form">'
        .'<div class="plinth-dialog-header">'
        .'<h2 id="archive-title" class="plinth-dialog-title">Archive 3 tickets?</h2>'
        .'</div>'
        .'<div class="plinth-dialog-body">'
        .'<p id="archive-message" class="plinth-confirm-dialog-message">You can bring them back.</p>'
        .'</div>'
        .'<div class="plinth-dialog-footer">'.$cancel.$confirm().'</div>'
        .'</form>'
        .'</dialog>'
    );
});

it('asks for a phrase, typed exactly, with the phrase in its label', function () use ($render) {
    expect($render('kind="type" phrase=" harbour "'))->toContain(
        '<div class="plinth-dialog-body">'
        .'<p id="archive-message" class="plinth-confirm-dialog-message">You can bring them back.</p>'
        .'<div class="plinth-confirm-dialog-field">'
        .'<label for="archive-field" class="plinth-confirm-dialog-label">Type <strong>harbour</strong> to confirm</label>'
        .'<input id="archive-field" class="plinth-confirm-dialog-input" type="text" name="confirmation" required pattern="harbour"'
        .' autocomplete="off" autocapitalize="none" spellcheck="false" >'
        .'</div>'
        .'</div>'
    );
});

it('asks for the password, and leaves checking it to the app', function () use ($render) {
    expect($render('kind="password"'))->toContain(
        '<div class="plinth-confirm-dialog-field">'
        .'<label for="archive-field" class="plinth-confirm-dialog-label">Password</label>'
        .'<input id="archive-field" class="plinth-confirm-dialog-input" type="password" name="password" required'
        .' autocomplete="current-password" >'
        .'</div>'
    );
});

it('takes the kind as the enum, and falls back to simple', function () use ($render) {
    expect($render(':kind="$kind"', ['kind' => ConfirmDialogKind::Password]))->toContain('type="password"')
        ->and($render('kind="pin"'))->not->toContain('plinth-confirm-dialog-field')
        ->and($render(':kind="null"'))->not->toContain('plinth-confirm-dialog-field');
});

it('escapes the phrase\'s pattern characters, and the phrase in the label', function () use ($render) {
    $html = $render('kind="type" :phrase="$phrase"', ['phrase' => 'a.b*c (d) [e] {f} |g\\h/i^$+? <j>']);

    expect($html)
        ->toContain('pattern="a\\.b\\*c \\(d\\) \\[e\\] \\{f\\} \\|g\\\\h\\/i\\^\\$\\+\\? &lt;j&gt;"')
        ->toContain('<strong>a.b*c (d) [e] {f} |g\\h/i^$+? &lt;j&gt;</strong>')
        ->not->toContain('<j>');
});

it('takes its own field label, escaped, with :phrase where the phrase goes', function () use ($render) {
    expect($render('kind="type" phrase="harbour" field-label="Escreva :phrase <b>já</b>"'))
        ->toContain('class="plinth-confirm-dialog-label">Escreva <strong>harbour</strong> &lt;b&gt;já&lt;/b&gt;</label>')
        ->and($render('kind="password" field-label="Palavra-passe"'))
        ->toContain('class="plinth-confirm-dialog-label">Palavra-passe</label>')
        ->and($render('kind="password" field-label="  "'))
        ->toContain('class="plinth-confirm-dialog-label">Password</label>');
});

it('shows the app\'s error under the field, and ties the field to it', function () use ($render) {
    $html = $render('kind="password" error="That password isn\'t right."');

    expect($html)
        ->toContain('autocomplete="current-password" aria-invalid="true" aria-describedby="archive-error" >')
        ->toContain('</div><p id="archive-error" class="plinth-confirm-dialog-error" role="alert">That password isn&#039;t right.</p></div>');
});

it('leaves out a blank error, and an error with no field', function () use ($render) {
    expect($render('kind="password" error="  "'))->not->toContain('aria-invalid')->not->toContain('-error')
        ->and($render('error="Gone wrong"'))->not->toContain('Gone wrong');
});

it('makes the confirm button busy while the app checks', function () use ($render) {
    expect($render('kind="password" busy'))->toContain(
        'data-variant="primary" data-size="md" aria-busy="true" aria-disabled="true" value="confirm">'
        .'<span class="plinth-button-spinner" aria-hidden="true"></span>'
    );
});

it('makes the confirm button the danger variant for the danger tone', function () use ($render, $confirm) {
    expect($render('tone="danger"'))->toContain($confirm('danger'))
        ->and($render(':tone="$tone"', ['tone' => ConfirmDialogTone::Danger]))->toContain($confirm('danger'))
        ->and($render('tone="loud"'))->toContain($confirm());
});

it('takes the labels of its buttons', function () {
    $html = Blade::render(
        '<x-plinth::confirm-dialog id="archive" title="Arquivar?" message="Pode recuperá-los." confirm-label="Arquivar" cancel-label="Cancelar" />'
    );

    expect($html)->toContain('>Arquivar</span>')->toContain('>Cancelar</span>');
});

it('confirms and cancels with its defaults', function () {
    $html = Blade::render('<x-plinth::confirm-dialog id="archive" title="Archive?" message="Sure?" />');

    expect($html)->toContain('>Confirm</span>')->toContain('>Cancel</span>');
});

it('takes a side on the phone, and falls back to centred, which prints nothing', function () use ($render) {
    expect($render('side-phone="bottom"'))->toContain('data-side-phone="bottom"')
        ->and($render(':side-phone="$side"', ['side' => DialogSidePhone::Bottom]))->toContain('data-side-phone="bottom"')
        ->and($render('side-phone="top"'))->not->toContain('data-side-phone');
});

it('generates an id when it has none, and wires its parts to it', function () {
    $html = Blade::render('<x-plinth::confirm-dialog title="Archive?" message="Sure?" kind="password" />');

    preg_match('/<dialog id="(plinth-confirm-dialog-[a-z0-9]{8})"/', $html, $match);

    expect($match)->toHaveCount(2)
        ->and($html)
        ->toContain('aria-labelledby="'.$match[1].'-title"')
        ->toContain('aria-describedby="'.$match[1].'-message"')
        ->toContain('<label for="'.$match[1].'-field"')
        ->toContain('commandfor="'.$match[1].'"');
});

it('trims the id it is given', function () {
    expect(Blade::render('<x-plinth::confirm-dialog id=" archive " title="Archive?" message="Sure?" />'))
        ->toContain('<dialog id="archive"')
        ->toContain('aria-labelledby="archive-title"');
});

it('says what it needs', function () {
    expect(fn () => Blade::render('<x-plinth::confirm-dialog id="archive" message="Sure?" />'))
        ->toThrow(Exception::class, 'needs a title')
        ->and(fn () => Blade::render('<x-plinth::confirm-dialog id="archive" title="Archive?" />'))
        ->toThrow(Exception::class, 'needs a message')
        ->and(fn () => Blade::render('<x-plinth::confirm-dialog id="archive" title="Archive?" message="Sure?" kind="type" />'))
        ->toThrow(Exception::class, 'needs a phrase');
});

it('escapes the title, the message, the error and the id', function () {
    $html = Blade::render(
        '<x-plinth::confirm-dialog :id="$id" :title="$title" :message="$message" kind="password" :error="$error" />',
        ['id' => 'a"b', 'title' => '<b>x</b>', 'message' => '<i>y</i>', 'error' => '<u>z</u>'],
    );

    expect($html)
        ->not->toContain('<b>')
        ->not->toContain('<i>')
        ->not->toContain('<u>')
        ->not->toContain('a"b')
        ->toContain('&lt;b&gt;x&lt;/b&gt;')
        ->toContain('&lt;i&gt;y&lt;/i&gt;')
        ->toContain('&lt;u&gt;z&lt;/u&gt;')
        ->toContain('id="a&quot;b"');
});

it('passes extra attributes to its root, and lets a project replace role and closedby', function () {
    $html = Blade::render(
        '<x-plinth::confirm-dialog id="archive" title="Archive?" message="Sure?" class="is-busy" closedby="any" role="dialog" wire:key="archive" wire:ignore.self x-on:submit="check" data-testid="archive" />'
    );

    expect($html)
        ->toContain('class="plinth-dialog plinth-confirm-dialog is-busy"')
        ->toContain('closedby="any"')
        ->not->toContain('closerequest')
        ->toContain('role="dialog"')
        ->not->toContain('alertdialog')
        ->toContain('wire:key="archive"')
        ->toContain('wire:ignore.self')
        ->toContain('x-on:submit="check"')
        ->toContain('data-testid="archive"');
});
