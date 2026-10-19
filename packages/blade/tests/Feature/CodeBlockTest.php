<?php

use Illuminate\Support\Facades\Blade;
use Illuminate\Support\HtmlString;

/** The rendered markup without the Alpine attributes on the copy button, which are tested apart. */
function withoutAlpine(string $html): string
{
    return squish(preg_replace('/ x-[a-z:.-]+="[^"]*"/', '', $html) ?? '');
}

$copy = '<button class="plinth-button plinth-code-block-copy" type="button" data-variant="ghost" data-size="sm" hidden="">'
    .'<span class="plinth-button-label">Copy</span></button>'
    .'<span class="plinth-code-block-status" role="status"></span>';

$tabs = [
    ['label' => 'Blade', 'code' => '<x-plinth::badge />'],
    ['label' => 'Vue', 'code' => '<PlinthBadge />'],
];

it('prints the label, the copy button and the code', function () use ($copy) {
    $html = Blade::render('<x-plinth::code-block label="brand.css">{{ $code }}</x-plinth::code-block>', [
        'code' => ":root {\n  --plinth-radius-pill: 0.25rem;\n}",
    ]);

    expect(withoutAlpine($html))->toBe(
        '<div class="plinth-code-block">'
        .'<div class="plinth-code-block-header">'
        .'<span class="plinth-code-block-label">brand.css</span>'
        .$copy
        .'</div>'
        .'<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>:root { --plinth-radius-pill: 0.25rem; }</code></pre>'
        .'</div>'
    );
});

it('keeps the code\'s lines and indentation', function () {
    $html = Blade::render('<x-plinth::code-block>{{ $code }}</x-plinth::code-block>', ['code' => "a\n  b"]);

    expect($html)->toContain("<code>a\n  b</code>");
});

it('prints language tabs and a <pre> for each, the first checked', function () use ($copy, $tabs) {
    $html = Blade::render('<x-plinth::code-block id="badge" :tabs="$tabs" />', ['tabs' => $tabs]);

    expect(withoutAlpine($html))->toBe(
        '<div id="badge" class="plinth-code-block">'
        .'<div class="plinth-code-block-header">'
        .'<div class="plinth-code-block-tabs" role="radiogroup" aria-label="Language">'
        .'<label class="plinth-code-block-tab"><input type="radio" class="plinth-code-block-tab-input" name="badge-language" checked><span class="plinth-code-block-tab-label">Blade</span></label>'
        .'<label class="plinth-code-block-tab"><input type="radio" class="plinth-code-block-tab-input" name="badge-language" ><span class="plinth-code-block-tab-label">Vue</span></label>'
        .'</div>'
        .$copy
        .'</div>'
        .'<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>&lt;x-plinth::badge /&gt;</code></pre>'
        .'<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>&lt;PlinthBadge /&gt;</code></pre>'
        .'</div>'
    );
});

it('checks the selected tab, and falls back to the first', function () use ($tabs) {
    $checked = function (?string $selected) use ($tabs) {
        $html = Blade::render('<x-plinth::code-block id="badge" :tabs="$tabs" :selected="$selected" />', [
            'tabs' => $tabs,
            'selected' => $selected,
        ]);
        preg_match('/name="badge-language" checked><span class="plinth-code-block-tab-label">(\w+)/', $html, $match);

        return $match[1] ?? null;
    };

    expect($checked('Vue'))->toBe('Vue')
        ->and($checked('Svelte'))->toBe('Blade')
        ->and($checked(null))->toBe('Blade');
});

it('takes the tabs\' accessible name', function () use ($tabs) {
    expect(Blade::render('<x-plinth::code-block :tabs="$tabs" tabs-label="Framework" />', ['tabs' => $tabs]))
        ->toContain('role="radiogroup" aria-label="Framework"');
});

it('generates the tabs\' name when it has no id', function () use ($tabs) {
    $html = Blade::render('<x-plinth::code-block :tabs="$tabs" />', ['tabs' => $tabs]);

    preg_match_all('/name="(plinth-code-block-[a-z0-9]{8}-language)"/', $html, $matches);

    expect($matches[1])->toHaveCount(2)
        ->and($matches[1][0])->toBe($matches[1][1])
        ->and($html)->not->toContain(' id=');
});

it('leaves out a blank label and id, and the copy button when copy is off', function () {
    $html = Blade::render('<x-plinth::code-block label=" " id=" " :copy="false">npm run build</x-plinth::code-block>');

    expect(squish($html))->toBe(
        '<div class="plinth-code-block"><div class="plinth-code-block-header"></div>'
        .'<pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>npm run build</code></pre></div>'
    );
});

it('takes a label slot with markup', function () {
    $html = Blade::render(
        '<x-plinth::code-block :copy="false"><x-slot:label>HTML <x-plinth::badge>Parity</x-plinth::badge></x-slot:label>'."\n".'x</x-plinth::code-block>'
    );

    expect(squish($html))->toContain(
        '<span class="plinth-code-block-label">HTML <span class="plinth-badge" data-tone="neutral"><span class="plinth-badge-label">Parity</span></span></span>'
    );
});

it('leaves out an empty label slot', function () {
    $html = Blade::render('<x-plinth::code-block><x-slot:label> </x-slot:label>'."\n".'x</x-plinth::code-block>');

    expect($html)->not->toContain('plinth-code-block-label');
});

it('prints a highlighter\'s markup as it is', function () {
    $html = Blade::render('<x-plinth::code-block>{!! $html !!}</x-plinth::code-block>', [
        'html' => '<span class="line"><span style="color: #e36209">const</span> a</span>',
    ]);

    expect($html)->toContain('<code><span class="line"><span style="color: #e36209">const</span> a</span></code>');
});

it('prints a tab\'s highlighted code as it is, and escapes plain code', function () {
    $html = Blade::render('<x-plinth::code-block :tabs="$tabs" />', ['tabs' => [
        ['label' => 'PHP', 'code' => new HtmlString('<span class="line">echo</span>')],
        ['label' => 'HTML', 'code' => '<b>x</b>'],
    ]]);

    expect($html)
        ->toContain('<code><span class="line">echo</span></code>')
        ->toContain('<code>&lt;b&gt;x&lt;/b&gt;</code>');
});

it('shows at most six tabs', function () {
    $tabs = array_map(fn (int $i) => ['label' => "T{$i}", 'code' => "c{$i}"], range(0, 6));
    $html = Blade::render('<x-plinth::code-block :tabs="$tabs" />', ['tabs' => $tabs]);

    expect(substr_count($html, '<input'))->toBe(6)
        ->and(substr_count($html, '<pre'))->toBe(6)
        ->and($html)->not->toContain('c6');
});

it('prints a tab\'s html key as it is, as Vue and React do', function () {
    $html = Blade::render('<x-plinth::code-block :tabs="$tabs" />', ['tabs' => [
        ['label' => 'PHP', 'code' => 'echo', 'html' => '<span class="line">echo</span>'],
    ]]);

    expect($html)->toContain('<code><span class="line">echo</span></code>');
});

it('takes the copy button\'s words', function () {
    $html = Blade::render('<x-plinth::code-block copy-label="Copiar" copied-label="Copiado">x</x-plinth::code-block>');

    expect($html)
        ->toContain('<span class="plinth-button-label">Copiar</span>')
        ->toContain('copyLabel: &#039;Copiar&#039;, copiedLabel: &#039;Copiado&#039;');
});

it('shows and wires the copy button with Alpine', function () {
    $html = Blade::render('<x-plinth::code-block>x</x-plinth::code-block>');

    expect($html)
        ->toContain('hidden=""')
        ->toContain('x-init="$el.hidden = ! navigator.clipboard"')
        ->toContain('x-on:click="copy"')
        ->toContain('async copy()')
        ->toContain('navigator.clipboard.writeText');
});

it('escapes the label, the tabs, the code and the id', function () {
    $html = Blade::render('<x-plinth::code-block :id="$id" :label="$label" :tabs="$tabs" :tabs-label="$label" />', [
        'id' => '"><b>x</b>',
        'label' => '<b>x</b>',
        'tabs' => [['label' => '<i>y</i>', 'code' => '<u>z</u>']],
    ]);

    expect($html)
        ->not->toContain('<b>')
        ->not->toContain('<i>')
        ->not->toContain('<u>')
        ->toContain('&lt;b&gt;x&lt;/b&gt;')
        ->toContain('&lt;i&gt;y&lt;/i&gt;')
        ->toContain('&lt;u&gt;z&lt;/u&gt;');
});

it('keeps extra classes and attributes on the root', function () {
    $html = Blade::render('<x-plinth::code-block class="ms-2" data-testid="install" aria-describedby="help" wire:key="install" x-show="open">x</x-plinth::code-block>');

    expect($html)->toContain(
        '<div class="plinth-code-block ms-2" data-testid="install" aria-describedby="help" wire:key="install" x-show="open">'
    );
});
