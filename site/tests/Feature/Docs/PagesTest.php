<?php

use App\Docs\Navigation;
use Illuminate\Support\Facades\File;

it('sends /docs to the introduction', function () {
    $this->get('/docs')->assertRedirect('/docs/introduction');
});

it('shows every page in the sidebar with the docs layout', function () {
    foreach (app(Navigation::class)->sections()->flatten(1) as $link) {
        $this->get($link->url())
            ->assertOk()
            ->assertHeaderMissing('Set-Cookie')
            ->assertSee('class="site-docs-title"', false)
            ->assertSee('<a class="site-docs-nav-link" href="'.$link->url().'"  aria-current="page" >', false)
            ->assertSee('class="plinth-sheet plinth-menu-sheet"', false)
            ->assertSee('id="docs-menu"', false);
    }
});

it('lays a guide out with its breadcrumb, lead, contents, previous and next, and edit link', function () {
    $this->get('/docs/branding')
        ->assertSee('<title>Branding your project · Plinth</title>', false)
        ->assertSeeInOrder(['Docs', 'Theming', 'Branding your project', 'Plinth ships a neutral, dark-first default.'])
        ->assertSee('On this page')
        ->assertSee('href="#override-the-semantic-tokens"', false)
        ->assertSeeInOrder(['Previous', 'Tailwind v4', 'Next', 'Dark mode'])
        ->assertSee('href="https://github.com/bdynamicpt/plinth/edit/main/site/docs/branding.md"', false)
        ->assertSee('<a class="site-header-link" href="/docs/introduction"  aria-current="page" >Docs</a>', false);
});

it('marks Foundations in the header on the foundations pages', function () {
    $this->get('/docs/colour')
        ->assertSee('<a class="site-header-link" href="/docs/foundations"  aria-current="page" >Foundations</a>', false);
});

it('has no previous on the first page, and leaves out a contents list with one section', function () {
    config(['docs.path' => $path = sys_get_temp_dir().'/plinth-docs-'.uniqid()]);
    File::ensureDirectoryExists($path);
    File::put("{$path}/introduction.md", "# Introduction\n\n## Only one\n");

    $this->get('/docs/introduction')
        ->assertOk()
        ->assertDontSee('rel="prev"', false)
        ->assertSee('rel="next"', false)
        ->assertDontSee('On this page');

    File::deleteDirectory($path);
});

it('renders CONTRIBUTING.md from the repository as the component rules', function () {
    $this->get('/docs/contributing')
        ->assertOk()
        ->assertSee('Contributing to Plinth')
        ->assertSee('href="https://github.com/bdynamicpt/plinth/edit/main/CONTRIBUTING.md"', false)
        ->assertSee('href="/docs/focus-ring"', false);
});

it('is not found for a page that is not in the sidebar or has no file', function () {
    config(['docs.path' => '/nowhere']);

    $this->get('/docs/not-a-page')->assertNotFound();
    $this->get('/docs/introduction')->assertNotFound();
});

it('finds the page before and after one', function () {
    $navigation = app(Navigation::class);

    expect($navigation->previous('introduction'))->toBeNull()
        ->and($navigation->next('introduction')?->slug)->toBe('installation')
        ->and($navigation->next('decisions'))->toBeNull()
        ->and($navigation->previous('nope'))->toBeNull()
        ->and($navigation->next('nope'))->toBeNull()
        ->and($navigation->find('decisions')?->url())->toBe(route('decisions.index'))
        ->and($navigation->find('decisions')?->toPager())->toBe(['label' => 'Decisions', 'url' => route('decisions.index')]);
});

it('lists the decisions, newest first, each a link to its page', function () {
    $this->get('/docs/decisions')
        ->assertOk()
        ->assertSee('<title>Decisions · Plinth</title>', false)
        ->assertSeeInOrder(['ADR 7', 'ADR 6', 'ADR 1'])
        ->assertSee('href="'.route('decisions.show', '0007-the-plinth-website').'"', false)
        ->assertSeeInOrder(['Previous', 'Releases', 'Next', 'ADR 1: Design tokens in DTCG']);
});

it('says so when there are no decisions', function () {
    config(['site.decisions' => '/nowhere']);

    $this->get('/docs/decisions')->assertOk()->assertSee('The decisions are not here yet.');
});

it('shows a decision with its number, summary, sections and neighbours', function () {
    $this->get('/docs/decisions/0003-visual-direction')
        ->assertOk()
        ->assertSeeInOrder(['ADR 3', 'Visual direction', 'A dense, quiet look, dark first.'])
        ->assertSee('href="#context"', false)
        ->assertSeeInOrder(['Previous', 'ADR 2: Behaviour through native elements', 'Next', 'ADR 4: One version for npm and Packagist'])
        ->assertSee('href="https://github.com/bdynamicpt/plinth/edit/main/docs/adr/0003-visual-direction.md"', false);
});

it('goes back to the list from the first decision, and has no next after the last', function () {
    $this->get('/docs/decisions/0001-design-tokens-in-dtcg-built-with-style-dictionary')
        ->assertSeeInOrder(['Previous', 'Decisions', 'Next', 'ADR 2']);

    $this->get('/docs/decisions/0007-the-plinth-website')
        ->assertSee('Previous')
        ->assertDontSee('rel="next"', false);
});

it('is not found for a decision that does not exist', function () {
    $this->get('/docs/decisions/0099-nothing')->assertNotFound();
});
