{{-- The site's footer: the wordmark, the licence and the links that don't fit in the header. --}}
@php
    $nav = config('site.nav');
    $columns = [
        'Learn' => [
            'Docs' => $nav['Docs'],
            'Foundations' => $nav['Foundations'],
            'Decisions' => route('decisions.index'),
        ],
        'Build' => [
            'Components' => $nav['Components'],
            'Storybook' => route('storybook').'/',
            'Changelog' => $nav['Changelog'],
        ],
        'Source' => [
            'GitHub' => config('site.repository'),
            'Issues' => config('site.repository').'/issues',
            'Licence' => config('site.source').'/LICENSE',
        ],
    ];
@endphp
<footer {{ $attributes->merge(['class' => 'site-footer']) }}>
    <div class="site-container site-footer-inner">
        <div class="site-footer-brand">
            <x-site.wordmark />
            <span class="site-meta">MIT licence · made by BDynamic</span>
        </div>
        @foreach ($columns as $heading => $links)
            <nav class="site-footer-column" aria-labelledby="footer-{{ Str::slug($heading) }}">
                <h2 id="footer-{{ Str::slug($heading) }}" class="site-footer-heading">{{ $heading }}</h2>
                <ul class="site-footer-links" role="list">
                    @foreach ($links as $label => $href)
                        <li><a class="site-footer-link" href="{{ $href }}">{{ $label }}</a></li>
                    @endforeach
                </ul>
            </nav>
        @endforeach
    </div>
</footer>
