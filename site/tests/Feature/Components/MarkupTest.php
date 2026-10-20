<?php

use App\Components\Markup;
use Illuminate\Support\Facades\Blade;

$example = <<<'BLADE'
<x-plinth::button variant="secondary" mirror-trailing busy>
    <x-slot:icon><x-site.glyph name="check" /></x-slot:icon>
    Don't save
</x-plinth::button>
<x-plinth::avatar name="Ana Lima" status-label="Online" class="ms-2" />
BLADE;

it('prints an example in Blade, tidied, with an icon standing for the project\'s own', function () use ($example) {
    expect(app(Markup::class)->blade($example))->toBe(<<<'BLADE'
        <x-plinth::button variant="secondary" mirror-trailing busy>
            <x-slot:icon><svg>…</svg></x-slot:icon>
            Don't save
        </x-plinth::button>
        <x-plinth::avatar name="Ana Lima" status-label="Online" class="ms-2" />
        BLADE);
});

it('prints the same example in Vue, with slots as templates', function () use ($example) {
    expect(app(Markup::class)->vue($example))->toBe(<<<'VUE'
        <PlinthButton variant="secondary" mirror-trailing busy>
          <template #icon><svg>…</svg></template>
          Don't save
        </PlinthButton>
        <PlinthAvatar name="Ana Lima" status-label="Online" class="ms-2" />
        VUE);
});

it('prints the same example in React, with props in camelCase and slots as props', function () use ($example) {
    expect(app(Markup::class)->react($example))->toBe(<<<'JSX'
        <PlinthButton variant="secondary" mirrorTrailing busy icon={<svg>…</svg>}>
          Don't save
        </PlinthButton>
        <PlinthAvatar name="Ana Lima" statusLabel="Online" className="ms-2" />
        JSX);
});

it('passes a slot of text, or of several nodes, as a React prop', function () {
    $markup = app(Markup::class);

    expect($markup->react('<x-plinth::callout><x-slot:title>Sent</x-slot:title>Done.</x-plinth::callout>'))
        ->toBe("<PlinthCallout title=\"Sent\">\n  Done.\n</PlinthCallout>")
        ->and($markup->react('<x-plinth::header><x-slot:actions><x-plinth::badge>A</x-plinth::badge><x-plinth::badge>B</x-plinth::badge></x-slot:actions></x-plinth::header>'))
        ->toBe('<PlinthHeader actions={<><PlinthBadge>A</PlinthBadge><PlinthBadge>B</PlinthBadge></>} />');
});

it('writes bound props as expressions and keeps HTML elements\' own names', function () {
    $markup = app(Markup::class);
    $source = '<x-plinth::pill-row :count="24" data-filter="status"><label for="a" class="x" tabindex="0">A</label></x-plinth::pill-row>';

    expect($markup->react($source))->toBe("<PlinthPillRow count={24} data-filter=\"status\">\n  <label htmlFor=\"a\" className=\"x\" tabIndex=\"0\">A</label>\n</PlinthPillRow>")
        ->and($markup->vue($source))->toBe("<PlinthPillRow :count=\"24\" data-filter=\"status\">\n  <label for=\"a\" class=\"x\" tabindex=\"0\">A</label>\n</PlinthPillRow>")
        ->and($markup->blade('<x-plinth::avatar name="Northwind &amp; Co." />'))->toBe('<x-plinth::avatar name="Northwind & Co." />')
        ->and($markup->html('<span title="A &amp; B">x</span>'))->toBe('<span title="A &amp; B">x</span>');
});

it('breaks a long element over lines, and keeps a short one on one', function () {
    $markup = app(Markup::class);
    $long = '<x-plinth::list-card heading="Team"><li><x-plinth::list-row href="#">Ana Lima</x-plinth::list-row></li></x-plinth::list-card>';

    expect($markup->blade($long))->toBe(<<<'BLADE'
        <x-plinth::list-card heading="Team">
            <li><x-plinth::list-row href="#">Ana Lima</x-plinth::list-row></li>
        </x-plinth::list-card>
        BLADE)
        ->and($markup->blade('<x-plinth::badge><b>A</b></x-plinth::badge>'))->toBe('<x-plinth::badge><b>A</b></x-plinth::badge>');
});

it('prints what Blade rendered as HTML, without Alpine\'s attributes, keeping code as it is', function () {
    $markup = app(Markup::class);
    $html = $markup->html(Blade::render('<x-plinth::button disabled>Save</x-plinth::button><x-plinth::code-block label="Terminal">npm  ci'."\n".'npm test</x-plinth::code-block>'));

    expect($html)->toContain("<button class=\"plinth-button\" type=\"button\" data-variant=\"primary\" data-size=\"md\" disabled>\n  <span class=\"plinth-button-label\">Save</span>\n</button>")
        ->toContain("<code>npm  ci\nnpm test</code></pre>")
        ->not->toContain('x-data')
        ->and($markup->html('<img src="a.png" alt=""><span aria-label="">x</span>'))->toBe('<img src="a.png" alt="">'."\n".'<span aria-label="">x</span>');
});
