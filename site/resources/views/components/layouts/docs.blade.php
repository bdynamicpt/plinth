{{--
    A docs page: the sidebar by section (from 1280px; below that, a menu sheet), the breadcrumb, the
    title and lead, the page, previous and next, the edit link, and the table of contents (from 1280px).
    The guides' sidebar is the default; the component pages pass their own `nav` and `crumbs`, and
    put what comes before the page's Markdown in the `intro` slot.
--}}
@props([
    'link' => null,
    'nav' => null,
    'crumbs' => null,
    'section' => null,
    'menu' => 'Docs',
    'wide' => false,
    'intro' => null,
    'title',
    'lead' => null,
    'eyebrow' => null,
    'headings' => [],
    'previous' => null,
    'next' => null,
    'edit' => null,
])
@php
    $nav ??= app(\App\Docs\Navigation::class)->sections()->map(fn ($links) => $links->map(fn ($item) => [
        'label' => $item->label,
        'url' => $item->url(),
        'current' => $item->slug === $link?->slug,
    ]));
    $crumbs ??= [['label' => 'Docs', 'url' => route('docs')], ['label' => $link?->section, 'url' => null]];
    $section ??= $link?->section === 'Foundations' ? 'Foundations' : 'Docs';
    $description = filled($lead) ? Str::of(strip_tags($lead))->squish()->limit(160)->toString() : null;
@endphp
<x-layouts.site :title="$title" :description="$description" :current="$section">
    <div @class(['site-container', 'site-docs', 'is-wide' => $wide])>
        <aside class="site-docs-side">
            <nav class="site-docs-nav" aria-label="{{ $menu }}">
                @foreach ($nav as $heading => $items)
                    <div class="site-docs-nav-section">
                        <h2 class="site-docs-nav-heading" id="docs-nav-{{ Str::slug($heading) }}">{{ $heading }}</h2>
                        <ul class="site-docs-nav-list" role="list" aria-labelledby="docs-nav-{{ Str::slug($heading) }}">
                            @foreach ($items as $item)
                                <li><a class="site-docs-nav-link" href="{{ $item['url'] }}" @if ($item['current']) aria-current="page" @endif>{{ $item['label'] }}</a></li>
                            @endforeach
                        </ul>
                    </div>
                @endforeach
            </nav>
        </aside>

        <article class="site-docs-article">
            <div class="site-docs-top">
                <nav class="site-docs-breadcrumb" aria-label="Breadcrumb">
                    <ol class="site-docs-breadcrumb-list" role="list">
                        @foreach ($crumbs as $crumb)
                            @if (filled($crumb['url']))
                                <li><a class="site-docs-breadcrumb-link" href="{{ $crumb['url'] }}">{{ $crumb['label'] }}</a></li>
                            @else
                                <li class="site-docs-breadcrumb-item">{{ $crumb['label'] }}</li>
                            @endif
                        @endforeach
                    </ol>
                </nav>
                <x-plinth::button class="site-docs-menu-button" variant="secondary" size="sm" commandfor="docs-menu" command="show-modal">
                    <x-slot:icon><x-site.glyph name="lines" /></x-slot:icon>
                    Menu
                </x-plinth::button>
            </div>

            <header class="site-docs-header">
                @if (filled($eyebrow))
                    <span class="site-eyebrow">{{ $eyebrow }}</span>
                @endif
                <h1 class="site-docs-title">{{ $title }}</h1>
                @if (filled($lead))
                    <p class="site-lead">{!! $lead !!}</p>
                @endif
            </header>

            {{ $intro }}

            <div class="site-prose">
                {{ $slot }}
            </div>

            @if ($previous || $next)
                <nav class="site-docs-pager" aria-label="Previous and next">
                    @if ($previous)
                        <a class="site-docs-pager-link" href="{{ $previous['url'] }}" rel="prev">
                            <span class="site-meta">Previous</span>
                            <span class="site-docs-pager-label">{{ $previous['label'] }}</span>
                        </a>
                    @endif
                    @if ($next)
                        <a class="site-docs-pager-link is-next" href="{{ $next['url'] }}" rel="next">
                            <span class="site-meta">Next</span>
                            <span class="site-docs-pager-label">{{ $next['label'] }}</span>
                        </a>
                    @endif
                </nav>
            @endif

            @if (filled($edit))
                <a class="site-link site-docs-edit" href="{{ $edit }}">
                    <x-plinth::icon size="sm"><x-site.glyph name="github" /></x-plinth::icon>
                    Edit this page on GitHub
                </a>
            @endif
        </article>

        @if (count($headings) > 1)
            <aside class="site-docs-toc">
                <nav class="site-docs-toc-nav" aria-labelledby="docs-toc-heading">
                    <h2 class="site-docs-toc-heading" id="docs-toc-heading">On this page</h2>
                    <ul class="site-docs-toc-list" role="list">
                        @foreach ($headings as $heading)
                            <li><a class="site-docs-toc-link" href="#{{ $heading['id'] }}">{{ $heading['text'] }}</a></li>
                        @endforeach
                    </ul>
                </nav>
            </aside>
        @endif
    </div>

    <x-plinth::menu-sheet id="docs-menu" :title="$menu">
        @foreach ($nav as $heading => $items)
            <x-plinth::list-card :heading="$heading">
                @foreach ($items as $item)
                    <li><x-plinth::list-row :href="$item['url']" :current="$item['current']">{{ $item['label'] }}</x-plinth::list-row></li>
                @endforeach
            </x-plinth::list-card>
        @endforeach
    </x-plinth::menu-sheet>
</x-layouts.site>
