{{-- The components: a card for each, with a live preview, filtered by group, and what is coming next. --}}
<x-layouts.site title="Components" description="Plinth's components: plain HTML and CSS with a markup contract, printed by thin Blade, Vue and React layers." current="Components">
    <div class="site-container site-catalogue">
        <header class="site-catalogue-header">
            <h1 class="site-docs-title">Components</h1>
            <p class="site-lead">Plain HTML and CSS, each with a markup contract that the Blade, Vue and React layers print. Every one is checked with axe in both themes at three widths.</p>
        </header>

        <x-plinth::pill-row nav label="Groups">
            <x-plinth::pill :href="route('components.index', [], false)" :selected="$group === null" :count="$groups->flatten(1)->count()">All</x-plinth::pill>
            @foreach ($groups as $name => $items)
                <x-plinth::pill :href="route('components.index', ['group' => Str::slug($name)], false)" :selected="$group === $name" :count="$items->count()">{{ $name }}</x-plinth::pill>
            @endforeach
        </x-plinth::pill-row>

        <ul class="site-catalogue-grid" role="list">
            @foreach ($components as $entry)
                <li class="site-component-card">
                    <div class="site-component-card-preview" inert>
                        @include('catalogue.previews.'.$entry->slug)
                    </div>
                    <div class="site-component-card-body">
                        <h2 class="site-title"><a class="site-component-card-link" href="{{ $entry->url() }}">{{ $entry->name }}</a></h2>
                        <p class="site-small">{{ $entry->description }}</p>
                        <span class="site-meta">{{ implode(' · ', $entry->layers()) }}</span>
                    </div>
                </li>
            @endforeach
        </ul>

        @if ($group === null && $coming !== [])
            <section class="site-catalogue-coming" aria-labelledby="coming-title">
                <h2 id="coming-title" class="site-catalogue-coming-title">Coming next</h2>
                <ul class="site-catalogue-grid" role="list">
                    @foreach ($coming as $issue => $item)
                        <li class="site-component-card is-coming">
                            <div class="site-component-card-body">
                                <div class="site-component-card-title">
                                    <h3 class="site-title"><a class="site-component-card-link" href="{{ config('site.repository') }}/issues/{{ $issue }}">{{ $item['name'] }}</a></h3>
                                    <x-plinth::badge>#{{ $issue }}</x-plinth::badge>
                                </div>
                                <p class="site-small">{{ $item['description'] }}</p>
                            </div>
                        </li>
                    @endforeach
                </ul>
            </section>
        @endif
    </div>
</x-layouts.site>
