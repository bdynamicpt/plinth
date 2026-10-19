<?php

use Illuminate\Support\Facades\Blade;

it('shows the home page with every section', function () {
    $this->get('/')
        ->assertOk()
        ->assertHeaderMissing('Set-Cookie')
        ->assertSeeInOrder([
            'One markup contract. Every framework.',
            'composer require bdynamicpt/plinth',
            'npm install @bdynamic/plinth',
            'Recent invoices',
            'Works with',
            'Write it in Blade, Vue or React. Ship the same HTML.',
            'Built on the platform. Tested on every story.',
            'Your brand is a few custom properties.',
            'Every decision, written down.',
            '15 components today, each with its contract.',
        ]);
});

it('builds the page from Plinth components', function () {
    $this->get('/')
        ->assertSee('class="plinth-button"', false)
        ->assertSee('class="plinth-header site-preview-header"', false)
        ->assertSee('class="plinth-pill-row"', false)
        ->assertSee('class="plinth-list-card"', false)
        ->assertSee('class="plinth-code-block"', false)
        ->assertSee('class="plinth-code-block site-layers-output"', false)
        ->assertSee('class="plinth-sheet plinth-menu-sheet"', false)
        ->assertSee('id="site-menu"', false);
});

it('shows the header and footer links', function () {
    $response = $this->get('/');

    foreach (config('site.nav') as $label => $href) {
        $response->assertSee('href="'.$href.'"', false)->assertSee($label);
    }

    $response->assertSee('aria-label="Plinth on GitHub"', false)
        ->assertSee('href="'.config('site.repository').'/issues"', false)
        ->assertSee('href="'.route('storybook').'/"', false);
});

it('shows the latest four decisions, newest first, with the newest announced in the hero', function () {
    $this->get('/')
        ->assertSee('New · ADR 7, the Plinth website')
        ->assertSeeInOrder(['ADR 7', 'The Plinth website', 'ADR 6', 'A React layer', 'ADR 5', 'Dialogs, sheets and drawers', 'ADR 4'])
        ->assertDontSee('ADR 3</span>', false);
});

it('leaves the decisions out when the ADRs are not there', function () {
    config(['site.decisions' => '/nowhere']);

    $this->get('/')
        ->assertOk()
        ->assertDontSee('Every decision, written down.')
        ->assertDontSee('site-announcement');
});

it('shows the HTML that the Blade example really prints', function () {
    $normalise = fn (string $html): string => trim(preg_replace(['/\s+/', '/>\s/', '/\s</'], [' ', '>', '<'], $html) ?? '');

    $rendered = Blade::render(file_get_contents(resource_path('snippets/button.blade.php.txt')) ?: '');

    expect($normalise(file_get_contents(resource_path('snippets/button.html.txt')) ?: ''))
        ->toBe($normalise($rendered));
});
