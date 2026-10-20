<?php

use App\Components\Catalogue;
use App\Components\Component;

it('lists every component with a live preview', function () {
    $response = $this->get('/components')
        ->assertOk()
        ->assertHeaderMissing('Set-Cookie')
        ->assertSee('<title>Components · Plinth</title>', false)
        ->assertSee('<a class="site-header-link" href="/components"  aria-current="page" >Components</a>', false)
        ->assertDontSee('Coming next');

    foreach (app(Catalogue::class)->all() as $component) {
        $response->assertSee('<a class="site-component-card-link" href="'.$component->url().'">'.$component->name.'</a>', false);
    }

    $response->assertSee('class="plinth-button"', false);
});

it('lists what is coming, by its issue', function () {
    config(['components.coming' => [99 => ['name' => 'Tabs', 'description' => 'Switches between views.']]]);

    $this->get('/components')
        ->assertOk()
        ->assertSee('Coming next')
        ->assertSee('href="https://github.com/bdynamicpt/plinth/issues/99"', false)
        ->assertSee('Switches between views.');
});

it('filters the components by group', function () {
    $this->get('/components?group=overlays')
        ->assertOk()
        ->assertSee('href="/components/sheet"', false)
        ->assertDontSee('href="/components/button"', false)
        ->assertDontSee('Coming next')
        ->assertSee('<a class="plinth-pill" href="/components?group=overlays" aria-current="page">', false);

    $this->get('/components?group=nope')->assertOk()->assertSee('href="/components/button"', false);
});

it('has a page for every component, in the docs layout, with its stories and sources', function () {
    foreach (app(Catalogue::class)->all() as $component) {
        $this->get($component->url())
            ->assertOk()
            ->assertSee('<h1 class="site-docs-title">'.$component->name.'</h1>', false)
            ->assertSee('<a class="site-docs-nav-link" href="'.$component->url().'"  aria-current="page" >', false)
            ->assertSee('href="'.$component->stories().'"', false)
            ->assertSee('href="https://github.com/bdynamicpt/plinth/blob/main/'.$component->files[0].'"', false)
            ->assertSee('href="https://github.com/bdynamicpt/plinth/edit/main/site/components/'.$component->slug.'.md"', false)
            ->assertSee('When not to use it')
            ->assertSee('Accessibility');
    }
});

it('shows the playground as the query string asks, in every layer', function () {
    $this->get('/components/button?variant=accent&size=lg&busy=1')
        ->assertOk()
        ->assertSee('id="playground"', false)
        ->assertSee('data-variant="accent" data-size="lg" aria-busy="true"', false)
        ->assertSee('Start free trial')
        ->assertSee('<a class="plinth-pill" href="?variant=accent&amp;size=lg#playground" aria-current="page" rel="nofollow">', false)
        ->assertSeeInOrder(['Blade', 'Vue', 'React', 'HTML']);
});

it('has no playground for a component without choices', function () {
    $this->get('/components/header')
        ->assertOk()
        ->assertDontSee('id="playground"', false)
        ->assertSee('HTML · Blade · Vue · React<', false);
});

it('is not found for a component it doesn\'t have, or one without its page', function () {
    $this->get('/components/nope')->assertNotFound();

    config(['components.path' => '/nowhere']);
    $this->get('/components/button')->assertNotFound();
});

it('lists the components on the home page', function () {
    $count = app(Catalogue::class)->all()->count();

    $this->get('/')->assertSee($count.' components today')->assertSee('href="/components"', false);
    expect(app(Catalogue::class)->all()->first())->toBeInstanceOf(Component::class);
});
