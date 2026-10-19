{{-- Plinth's default next to the example brand from the Branding guide, in real components. --}}
<div class="site-example site-brand-cards">
    @foreach (['Plinth default' => false, 'With brand.css' => true] as $label => $branded)
        <div @class(['site-brand-card', 'site-brand-example' => $branded])>
            <span class="site-meta">{{ $label }}</span>
            <x-plinth::badge tone="success" dot>Paid</x-plinth::badge>
            <x-plinth::button variant="accent">Start trial</x-plinth::button>
            <a class="site-link" href="{{ route('docs.show', 'colour') }}">See the colours</a>
        </div>
    @endforeach
</div>
