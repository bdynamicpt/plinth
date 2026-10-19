<x-layouts.site overlay>
    @php
        $nav = config('site.nav');
        $latest = $decisions->first();
        $installs = ['composer require bdynamicpt/plinth', 'npm install @bdynamic/plinth'];
    @endphp

    <section class="site-hero" aria-labelledby="hero-title">
        <div class="site-hero-glow" aria-hidden="true"></div>
        <div class="site-hero-content">
            @if ($latest)
                <a class="site-announcement" href="{{ route('decisions.show', $latest->slug()) }}">
                    <span class="site-announcement-dot" aria-hidden="true"></span>
                    New · ADR {{ $latest->number }}, {{ Str::lcfirst($latest->title) }}
                    <span class="site-announcement-arrow" aria-hidden="true">→</span>
                </a>
            @endif

            <h1 id="hero-title" class="site-display site-display-hero">One markup contract. Every framework.</h1>
            <p class="site-lead">Plinth is BDynamic's design system: tokens, components written as plain HTML and CSS, and thin Blade, Vue and React layers that print exactly the same markup.</p>

            <div class="site-actions">
                <x-plinth::button variant="accent" size="lg" :href="route('docs.show', 'installation')" mirror-trailing>
                    Get started
                    <x-slot:trailing><x-site.glyph name="arrow-right" /></x-slot:trailing>
                </x-plinth::button>
                <x-plinth::button variant="secondary" size="lg" :href="$nav['Components']">Browse components</x-plinth::button>
            </div>

            <div class="site-install">
                @foreach ($installs as $command)
                    <div class="site-install-row" x-data="copyCommand(@js($command))">
                        <span class="site-meta" aria-hidden="true">$</span>
                        <code class="site-install-command">{{ $command }}</code>
                        <x-plinth::button variant="ghost" size="sm" x-on:click="copy" x-cloak>
                            <span x-text="copied ? 'Copied' : 'Copy'">Copy</span>
                            <span class="site-visually-hidden"> {{ $command }}</span>
                        </x-plinth::button>
                        <span class="site-visually-hidden" role="status" x-text="copied ? 'Copied to the clipboard' : ''"></span>
                    </div>
                @endforeach
            </div>
            <span class="site-meta">MIT · Packagist and npm · pre-release</span>
        </div>

        <figure class="site-preview">
            <figcaption class="site-visually-hidden">An invoices screen built from Plinth's components: a header, status filters and a list of recent invoices.</figcaption>
            <div class="site-preview-app" inert>
                <div class="site-preview-side">
                    <span class="site-meta site-preview-side-heading">Billing</span>
                    <span class="site-preview-side-item is-current">Invoices<span class="site-meta">24</span></span>
                    <span class="site-preview-side-item">Clients<span class="site-meta">9</span></span>
                    <span class="site-preview-side-item">Projects<span class="site-meta">12</span></span>
                    <span class="site-preview-side-item">Team</span>
                </div>
                <div class="site-preview-main">
                    <x-plinth::header class="site-preview-header" title="Invoices">
                        <x-slot:leading>
                            <x-plinth::icon-button label="Back" mirror><x-site.glyph name="arrow-left" /></x-plinth::icon-button>
                        </x-slot:leading>
                        <x-slot:actions>
                            <x-plinth::button size="sm">New invoice</x-plinth::button>
                        </x-slot:actions>
                    </x-plinth::header>
                    <div class="site-preview-body">
                        <x-plinth::pill-row label="Status">
                            <x-plinth::pill count="24" selected>All</x-plinth::pill>
                            <x-plinth::pill count="18">Paid</x-plinth::pill>
                            <x-plinth::pill count="5">Drafts</x-plinth::pill>
                            <x-plinth::pill count="1">Overdue</x-plinth::pill>
                        </x-plinth::pill-row>
                        <x-plinth::list-card heading="Recent invoices">
                            <li>
                                <x-plinth::list-row href="#" description="INV-1042 · 2 min ago" chevron>
                                    <x-slot:leading><x-plinth::avatar name="Atlas Studio" size="sm" /></x-slot:leading>
                                    Atlas Studio
                                    <x-slot:trailing><x-plinth::badge tone="success" dot>Paid</x-plinth::badge></x-slot:trailing>
                                </x-plinth::list-row>
                            </li>
                            <li>
                                <x-plinth::list-row href="#" description="INV-1041 · yesterday" chevron>
                                    <x-slot:leading><x-plinth::avatar name="Brightline Co." size="sm" /></x-slot:leading>
                                    Brightline Co.
                                    <x-slot:trailing><x-plinth::badge tone="warning" dot>Draft</x-plinth::badge></x-slot:trailing>
                                </x-plinth::list-row>
                            </li>
                            <li>
                                <x-plinth::list-row href="#" description="INV-1039 · due 3 days ago" chevron>
                                    <x-slot:leading><x-plinth::avatar name="Kestrel Labs" size="sm" /></x-slot:leading>
                                    Kestrel Labs
                                    <x-slot:trailing><x-plinth::badge tone="danger">Overdue</x-plinth::badge></x-slot:trailing>
                                </x-plinth::list-row>
                            </li>
                        </x-plinth::list-card>
                    </div>
                </div>
            </div>
        </figure>
    </section>

    <section class="site-works" aria-labelledby="works-title">
        <div class="site-container site-works-inner">
            <h2 id="works-title" class="site-meta site-works-heading">Works with</h2>
            <ul class="site-works-list" role="list">
                @foreach (['Laravel', 'Filament', 'Vue 3', 'React 19', 'Tailwind v4', 'Plain HTML'] as $name)
                    <li class="site-works-item">{{ $name }}</li>
                @endforeach
            </ul>
        </div>
    </section>

    <section class="site-section" aria-labelledby="layers-title">
        <div class="site-container site-section-inner">
            <div class="site-section-intro">
                <span class="site-eyebrow">Three layers, one contract</span>
                <h2 id="layers-title" class="site-heading">Write it in Blade, Vue or React. Ship the same HTML.</h2>
                <p class="site-lead">Every component documents its markup contract: elements, classes, states and ARIA. The framework layers print it and hold no styles, and a parity test compares their output with the story on every pull request.</p>
            </div>
            <div class="site-layers">
                @foreach ($layers as $layer => $code)
                    <x-plinth::code-block :label="$layer">{{ $code }}</x-plinth::code-block>
                @endforeach
                <x-plinth::code-block class="site-layers-output">
                    <x-slot:label>
                        HTML, from all three
                        <x-plinth::badge tone="success" dot>Parity</x-plinth::badge>
                    </x-slot:label>
                    {{ $html }}
                </x-plinth::code-block>
            </div>
        </div>
    </section>

    <section class="site-section" aria-labelledby="foundations-title">
        <div class="site-container site-section-inner">
            <div class="site-section-intro">
                <span class="site-eyebrow">Foundations</span>
                <h2 id="foundations-title" class="site-heading">Built on the platform. Tested on every story.</h2>
            </div>
            <ul class="site-features" role="list">
                @foreach ([
                    ['layers', 'Tokens are the source of truth', 'DTCG JSON in three tiers, built to CSS custom properties, a JS and TypeScript export and a Tailwind v4 theme.'],
                    ['code', 'Native elements first', 'Dialog for sheets, popover for menus, details for disclosure. No Plinth JavaScript ships.'],
                    ['check', 'Accessible by test', 'Every story is checked with axe in light and dark, at 390, 768 and 1440 px, focus ring included.'],
                    ['lines', 'Dense, quiet, dark first', 'Geist and Geist Mono, 14px UI text, hairline borders, and controls that keep a 40px touch target.'],
                    ['window', 'Friendly with Tailwind', 'Components live in @layer plinth, so a utility class adjusts one without !important.'],
                    ['download', 'A Filament plugin', 'One line in a panel registers the CSS and fonts. Laravel needs no Node build.'],
                ] as [$icon, $title, $text])
                    <li class="site-feature">
                        <x-plinth::icon class="site-feature-icon"><x-site.glyph :name="$icon" /></x-plinth::icon>
                        <h3 class="site-title">{{ $title }}</h3>
                        <p class="site-small">{{ $text }}</p>
                    </li>
                @endforeach
            </ul>
        </div>
    </section>

    <section class="site-section" aria-labelledby="brand-title">
        <div class="site-container site-section-inner">
            <div class="site-section-intro">
                <span class="site-eyebrow">Brand per project</span>
                <h2 id="brand-title" class="site-heading">Your brand is a few custom properties.</h2>
                <p class="site-lead">Plinth ships a quiet, neutral default. A project overrides the semantic tokens after Plinth's CSS, in light and in dark, and never forks a component.</p>
            </div>
            <div class="site-brand">
                <x-plinth::code-block label="resources/css/brand.css">{{ $brand }}</x-plinth::code-block>
                <div class="site-brand-cards">
                    @foreach (['Plinth default' => false, 'With brand.css' => true] as $label => $branded)
                        <div @class(['site-brand-card', 'site-brand-example' => $branded])>
                            <span class="site-meta">{{ $label }}</span>
                            <x-plinth::badge tone="success" dot>Active</x-plinth::badge>
                            <x-plinth::button variant="accent">Start trial</x-plinth::button>
                            <a class="site-link" href="{{ route('docs.show', 'branding') }}">Read the guide</a>
                        </div>
                    @endforeach
                </div>
            </div>
        </div>
    </section>

    @if ($decisions->isNotEmpty())
        <section id="decisions" class="site-section site-section-sunken" aria-labelledby="decisions-title">
            <div class="site-container site-decisions-inner">
                <div class="site-section-intro site-decisions-intro">
                    <span class="site-eyebrow">Built in the open</span>
                    <h2 id="decisions-title" class="site-heading">Every decision, written down.</h2>
                    <p class="site-lead">Each choice that shapes Plinth is an architecture decision record in the repository, so you know what was decided and why.</p>
                    <a class="site-link site-link-strong" href="{{ route('decisions.index') }}">Read the decisions <span aria-hidden="true">→</span></a>
                </div>
                <x-site.decisions :decisions="$decisions" />
            </div>
        </section>
    @endif

    <section class="site-cta" aria-labelledby="cta-title">
        <div class="site-cta-glow" aria-hidden="true"></div>
        <div class="site-cta-content">
            <h2 id="cta-title" class="site-display">{{ count($components) }} components today, each with its contract.</h2>
            <p class="site-lead">{{ Str::ucfirst(Str::lower($components->join(', ', ' and '))) }}. Dialog and drawer are next.</p>
            <div class="site-actions">
                <x-plinth::button variant="accent" size="lg" :href="$nav['Components']">Browse components</x-plinth::button>
                <x-plinth::button variant="secondary" size="lg" :href="$nav['Docs']">Read the docs</x-plinth::button>
            </div>
        </div>
    </section>
</x-layouts.site>
