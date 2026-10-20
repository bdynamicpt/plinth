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
            'Same components. Your colour, your corners, your theme.',
            'Every decision, written down.',
            'An inbox, a settings page, billing, a landing page.',
            '18 components today, each with its contract.',
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
        ->assertSee('id="site-menu"', false)
        ->assertSee('class="plinth-section-menu"', false)
        ->assertSee('class="plinth-callout"', false)
        ->assertSee('class="plinth-avatar"', false);
});

it('shows the brand switcher with Plinth\'s defaults, ready for Alpine', function () {
    $this->get('/')
        ->assertSee('x-data="brandSwitcher(', false)
        ->assertSee('aria-labelledby="switcher-accent"', false)
        ->assertSee('aria-labelledby="switcher-corners"', false)
        ->assertSee('aria-labelledby="switcher-theme"', false)
        ->assertSeeInOrder(['Plinth blue', 'Teal', 'Ember', 'Violet', 'Sharp', 'Plinth', 'Round', 'Dark', 'Light'])
        ->assertSee('aria-pressed="true" x-bind:aria-pressed="String(accent === \'blue\')"', false)
        ->assertSee('<span x-text="pair.css">/* Plinth&#039;s defaults: nothing to override. */</span>', false)
        ->assertSee('--site-swatch: light-dark(oklch(0.52 0.1 185), oklch(0.76 0.12 180))', false);
});

it('shows the gallery with made-up content', function () {
    $this->get('/')
        ->assertSeeInOrder(['Inbox', 'Sam Carter', 'Settings', 'Alex Morgan', 'Billing', 'Your card expires next month', 'Invoices that chase themselves', 'Landing page']);
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
