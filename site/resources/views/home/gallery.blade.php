<section class="site-section" aria-labelledby="gallery-title">
    <div class="site-container site-section-inner">
        <div class="site-section-intro">
            <span class="site-eyebrow">Built from the same pieces</span>
            <h2 id="gallery-title" class="site-heading">An inbox, a settings page, billing, a landing page.</h2>
            <p class="site-lead">The screens most projects need, put together from Plinth's components.</p>
        </div>

        <ul class="site-gallery" role="list">
            <li>
                <figure class="site-tile">
                    <div class="site-tile-frame" inert>
                        <x-plinth::header class="site-preview-header" title="Inbox" />
                        <ul class="site-tile-list" role="list">
                            @foreach ([
                                ['Sam Carter', 'Can we move the review to Thursday?', null],
                                ['Kestrel Labs', 'Signed contract attached', '09:12'],
                                ['Brightline Co.', 'Thanks, payment sent', 'Mon'],
                            ] as [$name, $message, $time])
                                <li>
                                    <x-plinth::list-row :description="$message">
                                        <x-slot:leading><x-plinth::avatar :name="$name" decorative /></x-slot:leading>
                                        {{ $name }}
                                        <x-slot:trailing>
                                            @if ($time)
                                                {{ $time }}
                                            @else
                                                <x-plinth::badge>2</x-plinth::badge>
                                            @endif
                                        </x-slot:trailing>
                                    </x-plinth::list-row>
                                </li>
                            @endforeach
                        </ul>
                    </div>
                    <figcaption class="site-tile-caption">
                        <h3 class="site-title">Inbox</h3>
                        <p class="site-small">Header, list rows, avatars and badges.</p>
                    </figcaption>
                </figure>
            </li>

            <li>
                <figure class="site-tile">
                    <div class="site-tile-frame" inert>
                        <x-plinth::header class="site-preview-header" title="Settings" />
                        <x-plinth::section-menu label="Settings">
                            <x-plinth::section-menu-item href="#" current>Profile</x-plinth::section-menu-item>
                            <x-plinth::section-menu-item href="#">Team</x-plinth::section-menu-item>
                            <x-plinth::section-menu-item href="#">Billing</x-plinth::section-menu-item>
                        </x-plinth::section-menu>
                        <div class="site-tile-body">
                            <x-plinth::list-card>
                                <li>
                                    <x-plinth::list-row>
                                        Name
                                        <x-slot:trailing>Alex Morgan</x-slot:trailing>
                                    </x-plinth::list-row>
                                </li>
                                <li>
                                    <x-plinth::list-row>
                                        Language
                                        <x-slot:trailing>English</x-slot:trailing>
                                    </x-plinth::list-row>
                                </li>
                            </x-plinth::list-card>
                        </div>
                    </div>
                    <figcaption class="site-tile-caption">
                        <h3 class="site-title">Settings</h3>
                        <p class="site-small">Section menu and list card.</p>
                    </figcaption>
                </figure>
            </li>

            <li>
                <figure class="site-tile">
                    <div class="site-tile-frame" inert>
                        <x-plinth::header class="site-preview-header" title="Billing">
                            <x-slot:actions>
                                <x-plinth::button variant="secondary" size="sm">Invoices</x-plinth::button>
                            </x-slot:actions>
                        </x-plinth::header>
                        <div class="site-tile-body">
                            <x-plinth::callout tone="warning" title="Your card expires next month">
                                <x-slot:actions>
                                    <x-plinth::button variant="secondary" size="sm">Update card</x-plinth::button>
                                </x-slot:actions>
                            </x-plinth::callout>
                            <div class="site-tile-plan">
                                <div>
                                    <p class="site-tile-plan-name">Team plan</p>
                                    <p class="site-small">Renews 1 November</p>
                                </div>
                                <x-plinth::badge tone="success" dot>Active</x-plinth::badge>
                            </div>
                        </div>
                    </div>
                    <figcaption class="site-tile-caption">
                        <h3 class="site-title">Billing</h3>
                        <p class="site-small">Callout, badges and buttons.</p>
                    </figcaption>
                </figure>
            </li>

            <li>
                <figure class="site-tile">
                    <div class="site-tile-frame site-tile-landing" inert>
                        <span class="site-eyebrow">For small studios</span>
                        <p class="site-tile-headline">Invoices that chase themselves</p>
                        <p class="site-small">Reminders, receipts and reports, in each client's language.</p>
                        <div class="site-buttons">
                            <x-plinth::button variant="accent">Start free trial</x-plinth::button>
                            <x-plinth::button variant="ghost">See pricing</x-plinth::button>
                        </div>
                    </div>
                    <figcaption class="site-tile-caption">
                        <h3 class="site-title">Landing page</h3>
                        <p class="site-small">The accent, kept for marketing moments.</p>
                    </figcaption>
                </figure>
            </li>
        </ul>
    </div>
</section>
