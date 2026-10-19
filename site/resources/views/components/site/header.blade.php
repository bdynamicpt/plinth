{{-- The site's header: the wordmark, the main navigation, the theme switch, GitHub and, on a phone, the menu. --}}
@props(['overlay' => false])
@php
    $nav = config('site.nav');
@endphp
<header
    {{ $attributes->class(['site-header', 'is-overlay' => $overlay]) }}
    @if ($overlay)
        x-data="siteHeader"
        x-bind:class="{ 'is-scrolled': scrolled }"
        x-on:scroll.window.passive="update"
    @endif
>
    <div class="site-header-inner">
        <a class="site-header-home" href="{{ route('home') }}" aria-label="Plinth, home">
            <x-site.wordmark />
        </a>

        <nav class="site-header-nav" aria-label="Main">
            @foreach ($nav as $label => $href)
                <a class="site-header-link" href="{{ $href }}">{{ $label }}</a>
            @endforeach
        </nav>

        <div class="site-header-actions">
            <div class="site-theme-switch" x-data="themeSwitch" x-cloak>
                <x-plinth::icon-button label="Dark theme" :pressed="false" x-bind:aria-pressed="dark ? 'true' : 'false'" x-on:click="toggle">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path class="site-theme-switch-moon" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"></path>
                        <g class="site-theme-switch-sun"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"></path></g>
                    </svg>
                </x-plinth::icon-button>
            </div>
            <x-plinth::icon-button label="Plinth on GitHub" :href="config('site.repository')">
                <x-site.glyph name="github" />
            </x-plinth::icon-button>
            <x-plinth::button class="site-header-cta" variant="accent" :href="$nav['Docs']">Get started</x-plinth::button>
            <x-plinth::icon-button class="site-header-menu" label="Open the menu" commandfor="site-menu" command="show-modal">
                <x-site.glyph name="menu" />
            </x-plinth::icon-button>
        </div>
    </div>
</header>

<x-plinth::menu-sheet id="site-menu" title="Menu">
    <x-plinth::list-card>
        @foreach ($nav as $label => $href)
            <li><x-plinth::list-row :href="$href" chevron>{{ $label }}</x-plinth::list-row></li>
        @endforeach
        <li><x-plinth::list-row :href="config('site.repository')" chevron>GitHub</x-plinth::list-row></li>
    </x-plinth::list-card>
</x-plinth::menu-sheet>
