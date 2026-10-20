<?php

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

it('serves the index at /search.json, without a cookie', function () {
    $this->get('/search.json')
        ->assertOk()
        ->assertHeader('Content-Type', 'application/json')
        ->assertHeaderMissing('Set-Cookie')
        ->assertJsonPath('groups.0', 'Getting started')
        ->assertJsonFragment(['url' => '/docs/installation', 'title' => 'Installation']);
});

it('writes the index to public/search.json for a deploy', function () {
    $this->app->usePublicPath($public = sys_get_temp_dir().'/plinth-search-public-'.uniqid());
    File::ensureDirectoryExists($public);

    expect(Artisan::call('site:search-index'))->toBe(0)
        ->and(Artisan::output())->toContain('entries written to public/search.json.');

    $index = json_decode(File::get("{$public}/search.json"), true);
    File::deleteDirectory($public);

    expect($index['groups'])->toContain('Components')
        ->and($index['entries'][0])->toHaveKeys(['group', 'title', 'url', 'detail', 'text'])
        ->and(File::get(base_path('deploy/build.sh')))->toContain('php artisan site:search-index');
});

it('puts the search in the header of every page, opened by its buttons', function () {
    foreach (['/', '/docs/installation', '/components', '/components/button', '/docs/decisions'] as $page) {
        $this->get($page)
            ->assertOk()
            ->assertSee('<dialog id="site-search" class="plinth-sheet site-search"', false)
            ->assertSee('x-data="siteSearch(\'\/search.json\')"', false)
            ->assertSee('commandfor="site-search" command="show-modal" aria-keyshortcuts="Meta+K Control+K"', false)
            ->assertSee('<label class="site-visually-hidden" for="site-search-input">Search the docs</label>', false)
            ->assertSee('interactive-widget=resizes-content', false);
    }
});

it('works as a list of pages to start from without the script', function () {
    $this->get('/')
        ->assertSee('Search needs JavaScript. Start from one of these pages instead.')
        ->assertSeeInOrder(['Start here', 'href="/docs/introduction"', 'href="/docs/installation"', 'href="/docs/branding"', 'href="/components"'], false);
});
