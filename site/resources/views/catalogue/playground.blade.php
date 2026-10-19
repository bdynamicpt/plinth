{{--
    The playground: the component as the options and states make it, the choices, and its code in
    each layer. Each choice is a link to the same page with a query string, so it works without
    JavaScript; with it, the playground script swaps the section in place.
--}}
<section id="playground" class="site-playground" aria-labelledby="playground-title" x-data="playground">
    <h2 id="playground-title" class="site-visually-hidden">Playground</h2>
    <div class="site-demo-stage site-playground-stage">
        {{ $preview }}
    </div>
    <div class="site-playground-controls">
        @foreach ($playground->options as $name => $option)
            <div class="site-playground-control">
                <span class="site-meta" id="playground-{{ $name }}">{{ Str::ucfirst($name) }}</span>
                <x-plinth::pill-row nav aria-labelledby="playground-{{ $name }}">
                    @foreach ($option['values'] as $value)
                        <x-plinth::pill :href="$playground->link($values, $name, $value)" :selected="$values[$name] === $value" rel="nofollow">{{ $value }}</x-plinth::pill>
                    @endforeach
                </x-plinth::pill-row>
            </div>
        @endforeach
        @if ($playground->states !== [])
            <div class="site-playground-control">
                <span class="site-meta" id="playground-states">State</span>
                <x-plinth::pill-row nav aria-labelledby="playground-states">
                    @foreach ($playground->states as $state)
                        <x-plinth::pill :href="$playground->link($values, $state)" :selected="$values[$state]" rel="nofollow">{{ $state }}</x-plinth::pill>
                    @endforeach
                </x-plinth::pill-row>
            </div>
        @endif
    </div>
    <x-plinth::code-block class="site-demo-code" :tabs="$tabs" tabs-label="Markup in" />
</section>
