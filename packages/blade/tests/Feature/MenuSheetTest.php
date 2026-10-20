<?php

use Illuminate\Support\Facades\Blade;

$menu = fn (string $attributes = '', string $slots = '') => squish(Blade::render(
    '<x-plinth::menu-sheet id="menu" '.$attributes.'><a href="/inbox">Inbox</a>'.$slots.'</x-plinth::menu-sheet>'
));

it('prints a sheet with the user, the nav and the account', function () {
    $html = squish(Blade::render(
        '<x-plinth::menu-sheet id="menu" user-name="Sam Lee" user-detail="sam@example.com" user-href="/profile">'
        .'<a href="/inbox">Inbox</a>'
        .'<x-slot:account><button type="button">Sign out</button></x-slot:account>'
        .'</x-plinth::menu-sheet>'
    ));

    expect($html)
        ->toStartWith('<dialog id="menu" class="plinth-sheet plinth-menu-sheet" data-side="end" data-side-phone="bottom" closedby="any" aria-labelledby="menu-title">')
        ->toContain('<h2 id="menu-title" class="plinth-sheet-title">Menu</h2>')
        ->toContain('aria-label="Close" commandfor="menu" command="close"')
        ->toContain(
            '<div class="plinth-sheet-body">'
            .'<a class="plinth-list-row plinth-menu-sheet-user" href="/profile">'
            .'<span class="plinth-list-row-leading"><span class="plinth-avatar" data-size="lg" aria-hidden="true">'
            .'<span class="plinth-avatar-initials" aria-hidden="true">SL</span></span></span>'
            .'<span class="plinth-list-row-content"><span class="plinth-list-row-title">Sam Lee</span>'
            .'<span class="plinth-list-row-description">sam@example.com</span></span>'
            .'<span class="plinth-list-row-trailing"><span class="plinth-icon plinth-list-row-chevron"'
        )
        ->toEndWith(
            '<nav class="plinth-menu-sheet-nav" aria-labelledby="menu-title"><a href="/inbox">Inbox</a></nav>'
            .'<div class="plinth-menu-sheet-account"><button type="button">Sign out</button></div>'
            .'</div></dialog>'
        )
        ->not->toContain('plinth-sheet-footer');
});

it('prints a static user row with no chevron when it has no href', function () use ($menu) {
    foreach (['', 'user-href=" "'] as $href) {
        $html = $menu('user-name="Sam Lee" '.$href);

        expect($html)
            ->toContain('<div class="plinth-list-row plinth-menu-sheet-user">')
            ->not->toContain('plinth-list-row-chevron')
            ->not->toContain('plinth-list-row-description');
    }
});

it('shows the user\'s picture', function () use ($menu) {
    expect($menu('user-name="Sam Lee" user-src="/sam.jpg"'))
        ->toContain('<img class="plinth-avatar-image" src="/sam.jpg" alt="">')
        ->not->toContain('plinth-avatar-initials');
});

it('leaves out the user row without a name, and a blank detail and account', function () use ($menu) {
    foreach (['', 'user-name=" "'] as $name) {
        expect($menu($name.' user-detail=" "', '<x-slot:account> </x-slot:account>'))
            ->not->toContain('plinth-menu-sheet-user')
            ->not->toContain('plinth-menu-sheet-account')
            ->toContain('<div class="plinth-sheet-body"><nav class="plinth-menu-sheet-nav"');
    }

    expect($menu('user-name="Sam Lee" user-detail=" "'))->not->toContain('plinth-list-row-description');
});

it('takes the title and the close button\'s label', function () use ($menu) {
    expect($menu('title="Navegação" close-label="Fechar"'))
        ->toContain('<h2 id="menu-title" class="plinth-sheet-title">Navegação</h2>')
        ->toContain('aria-label="Fechar"');
});

it('generates an id when it has none, and wires the title and the nav to it', function () {
    $html = Blade::render('<x-plinth::menu-sheet>Inbox</x-plinth::menu-sheet>');

    preg_match('/<dialog id="(plinth-menu-sheet-[a-z0-9]{8})"/', $html, $match);

    expect($match)->toHaveCount(2)
        ->and($html)
        ->toContain('<h2 id="'.$match[1].'-title"')
        ->toContain('<nav class="plinth-menu-sheet-nav" aria-labelledby="'.$match[1].'-title">')
        ->toContain('commandfor="'.$match[1].'"');
});

it('trims the id it is given', function () {
    expect(Blade::render('<x-plinth::menu-sheet id=" menu ">Inbox</x-plinth::menu-sheet>'))
        ->toContain('<dialog id="menu"')
        ->toContain('aria-labelledby="menu-title">');
});

it('escapes the user\'s name, detail and href, and the id', function () {
    $html = Blade::render(
        '<x-plinth::menu-sheet :id="$id" :user-name="$name" :user-detail="$detail" :user-href="$href">Inbox</x-plinth::menu-sheet>',
        ['id' => 'a"b', 'name' => '<b>Sam</b>', 'detail' => '<i>x</i>', 'href' => '/p?a=1&b="2"'],
    );

    expect($html)
        ->not->toContain('<b>')
        ->not->toContain('<i>')
        ->toContain('&lt;b&gt;Sam&lt;/b&gt;')
        ->toContain('&lt;i&gt;x&lt;/i&gt;')
        ->toContain('href="/p?a=1&amp;b=&quot;2&quot;"')
        ->toContain('aria-labelledby="a&quot;b-title"');
});

it('merges extra attributes onto the dialog', function () use ($menu) {
    expect($menu('class="is-shell" wire:ignore.self closedby="closerequest" data-testid="menu"'))
        ->toStartWith('<dialog id="menu" class="plinth-sheet plinth-menu-sheet is-shell" data-side="end" data-side-phone="bottom" closedby="closerequest"')
        ->toContain('wire:ignore.self')
        ->toContain('data-testid="menu"');
});
