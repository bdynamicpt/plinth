@php
    use App\BrandSwitcher;

    $accent = BrandSwitcher::DEFAULT_ACCENT;
    $corners = BrandSwitcher::DEFAULT_CORNERS;
    $swatches = $switcher->swatches();
@endphp

<section class="site-section" aria-labelledby="switcher-title">
    <div class="site-container site-section-inner">
        <div class="site-section-intro">
            <span class="site-eyebrow">Try it</span>
            <h2 id="switcher-title" class="site-heading">Same components. Your colour, your corners, your theme.</h2>
            <p class="site-lead">Pick a brand colour, corners and a theme. The cards are Plinth's real components, restyled live by the CSS that a project would write.</p>
        </div>

        <div class="site-switcher" x-data="brandSwitcher(@js($switcher->pairs()), @js($accent), @js($corners))">
            <div class="site-switcher-controls">
                <div class="site-switcher-group" x-cloak>
                    <span id="switcher-accent" class="site-switcher-label">Brand colour</span>
                    <x-plinth::pill-row class="site-switcher-pills" aria-labelledby="switcher-accent">
                        @foreach (BrandSwitcher::ACCENTS as $id => $choice)
                            <x-plinth::pill :selected="$id === $accent" x-bind:aria-pressed="String(accent === '{{ $id }}')" x-on:click="accent = '{{ $id }}'"><span class="site-swatch" style="--site-swatch: {{ $swatches[$id] }}" aria-hidden="true"></span>{{ $choice['label'] }}</x-plinth::pill>
                        @endforeach
                    </x-plinth::pill-row>
                </div>

                <div class="site-switcher-group" x-cloak>
                    <span id="switcher-corners" class="site-switcher-label">Corners</span>
                    <x-plinth::pill-row class="site-switcher-pills" aria-labelledby="switcher-corners">
                        @foreach (BrandSwitcher::CORNERS as $id => $choice)
                            <x-plinth::pill :selected="$id === $corners" x-bind:aria-pressed="String(corners === '{{ $id }}')" x-on:click="corners = '{{ $id }}'">{{ $choice['label'] }}</x-plinth::pill>
                        @endforeach
                    </x-plinth::pill-row>
                </div>

                <div class="site-switcher-group" x-cloak>
                    <span id="switcher-theme" class="site-switcher-label">Theme</span>
                    <x-plinth::pill-row class="site-switcher-pills" aria-labelledby="switcher-theme">
                        @foreach (['dark' => 'Dark', 'light' => 'Light'] as $id => $label)
                            <x-plinth::pill x-bind:aria-pressed="String(shown === '{{ $id }}')" x-on:click="theme = '{{ $id }}'">{{ $label }}</x-plinth::pill>
                        @endforeach
                    </x-plinth::pill-row>
                </div>

            </div>

            <figure class="site-switcher-preview" x-bind:style="pair.style" x-bind:data-theme="theme">
                <figcaption class="site-visually-hidden">Two cards built from Plinth's components and restyled by the brand colour, corners and theme picked: a profile with its settings, and an announcement with a call to action.</figcaption>
                <div class="site-switcher-cards" inert>
                    <div class="site-switcher-card">
                        <div class="site-switcher-person">
                            <x-plinth::avatar name="Alex Morgan" size="lg" status="success" status-label="Online" />
                            <div class="site-switcher-person-text">
                                <p class="site-switcher-name">Alex Morgan</p>
                                <p class="site-small">Product lead · Online</p>
                            </div>
                        </div>
                        <x-plinth::pill-row class="site-switcher-pills" label="Section">
                            <x-plinth::pill selected>Profile</x-plinth::pill>
                            <x-plinth::pill>Team</x-plinth::pill>
                            <x-plinth::pill>Billing</x-plinth::pill>
                        </x-plinth::pill-row>
                        <x-plinth::list-card>
                            <li>
                                <x-plinth::list-row description="Email and push">
                                    Notifications
                                    <x-slot:trailing>On</x-slot:trailing>
                                </x-plinth::list-row>
                            </li>
                            <li>
                                <x-plinth::list-row>
                                    Language
                                    <x-slot:trailing>English</x-slot:trailing>
                                </x-plinth::list-row>
                            </li>
                        </x-plinth::list-card>
                        <div class="site-buttons">
                            <x-plinth::button>Save changes</x-plinth::button>
                            <x-plinth::button variant="ghost">Cancel</x-plinth::button>
                        </div>
                    </div>

                    <div class="site-switcher-card site-switcher-card-spread">
                        <div class="site-switcher-announcement">
                            <span class="site-eyebrow">New in October</span>
                            <p class="site-switcher-headline">Send invoices in your client's language</p>
                            <p class="site-small">Pick a language per client, and the reminders follow it.</p>
                        </div>
                        <div class="site-buttons">
                            <x-plinth::button variant="accent">Start free trial</x-plinth::button>
                            <a class="site-link" href="#">Read the changelog</a>
                        </div>
                        <div class="site-switcher-badges">
                            <x-plinth::badge tone="success" dot>Paid</x-plinth::badge>
                            <x-plinth::badge tone="warning" dot>Due soon</x-plinth::badge>
                            <x-plinth::badge tone="danger" dot>Overdue</x-plinth::badge>
                        </div>
                    </div>
                </div>
            </figure>

            <x-plinth::code-block class="site-switcher-code" label="resources/css/brand.css"><span x-text="pair.css">{{ $switcher->css($accent, $corners) }}</span></x-plinth::code-block>
        </div>
    </div>
</section>
