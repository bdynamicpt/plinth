{{--
    The search (⌘K): a sheet with a field and the results, grouped by section. The siteSearch
    script loads the index (/search.json) the first time the sheet takes focus, and filters it as
    you type. The header's search buttons, and ⌘K or Ctrl+K, open it.
--}}
@php
    // The group's heading and the result's detail are filled in by the script.
    $heading = new Illuminate\Support\HtmlString('<span x-text="group.name"></span>');
    $detail = new Illuminate\Support\HtmlString('<span x-text="result.detail"></span>');
    $start = [
        'Introduction' => route('docs.show', 'introduction', false),
        'Installation' => route('docs.show', 'installation', false),
        'Branding your project' => route('docs.show', 'branding', false),
        'Components' => route('components.index', [], false),
    ];
@endphp
<x-plinth::sheet
    id="site-search"
    title="Search"
    class="site-search"
    x-data="siteSearch({{ Js::from(route('search', [], false)) }})"
    x-on:focusin.once="load"
    x-on:click="pick"
>
    <div class="site-search-field">
        <x-plinth::icon class="site-search-field-icon" size="sm"><x-site.glyph name="search" /></x-plinth::icon>
        <label class="site-visually-hidden" for="site-search-input">Search the docs</label>
        <input
            id="site-search-input"
            class="site-search-input"
            type="search"
            placeholder="Guides, components, decisions"
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="go"
            autofocus
            aria-describedby="site-search-status"
            x-model="query"
            x-on:focus="$el.select()"
            x-on:keydown.down.prevent="focus(0)"
            x-on:keydown.enter.prevent="query.trim() && open(0)"
        >
    </div>

    <p id="site-search-status" class="site-search-status" role="status" x-text="status">
        Search needs JavaScript. Start from one of these pages instead.
    </p>

    <p class="site-search-keys" x-show="query.trim() === ''" x-cloak><kbd>↑</kbd> <kbd>↓</kbd> to move, <kbd>Enter</kbd> to open, <kbd>Esc</kbd> to close</p>

    <div class="site-search-results" x-ref="results" x-on:keydown.down.prevent="step(1)" x-on:keydown.up.prevent="step(-1)">
        {{-- Before a query, and without the script: where most people start. --}}
        <x-plinth::list-card class="site-search-start" heading="Start here" heading-level="h3" x-show="query.trim() === ''">
            @foreach ($start as $label => $href)
                <li><x-plinth::list-row :href="$href" chevron>{{ $label }}</x-plinth::list-row></li>
            @endforeach
        </x-plinth::list-card>

        <template x-for="group in groups" x-bind:key="group.name">
            <x-plinth::list-card heading-level="h3" :heading="$heading">
                <template x-for="result in group.results" x-bind:key="result.url">
                    <li>
                        <x-plinth::list-row href="#" x-bind:href="result.url" :description="$detail">
                            <span x-text="result.title"></span>
                        </x-plinth::list-row>
                    </li>
                </template>
            </x-plinth::list-card>
        </template>
    </div>
</x-plinth::sheet>
