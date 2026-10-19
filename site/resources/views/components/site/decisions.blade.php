{{-- A list of architecture decision records, each row a link to its page. --}}
@props(['decisions'])
<ol {{ $attributes->merge(['class' => 'site-decisions']) }} role="list">
    @foreach ($decisions as $decision)
        <li class="site-decision">
            @if ($decision->date)
                <time class="site-meta site-decision-date" datetime="{{ $decision->date->toDateString() }}">{{ $decision->date->format('j M Y') }}</time>
            @endif
            <span class="site-decision-content">
                <span class="site-decision-title">
                    <x-plinth::badge>ADR {{ $decision->number }}</x-plinth::badge>
                    <a class="site-decision-link" href="{{ route('decisions.show', $decision->slug()) }}">{{ $decision->title }}</a>
                </span>
                @if ($decision->summary)
                    <span class="site-small">{{ $decision->summary }}</span>
                @endif
            </span>
        </li>
    @endforeach
</ol>
