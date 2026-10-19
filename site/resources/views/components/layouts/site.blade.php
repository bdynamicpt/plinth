{{-- The site's page: head, header, main and footer. `overlay` lets the header sit over a hero until the page scrolls; `current` is the main navigation's item for the page. --}}
@props([
    'title' => null,
    'description' => 'Plinth is BDynamic\'s design system: tokens, components written as plain HTML and CSS, and thin Blade, Vue and React layers that print the same markup.',
    'overlay' => false,
    'current' => null,
])
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ filled($title) ? $title.' · Plinth' : 'Plinth, the design system with one markup contract' }}</title>
    <meta name="description" content="{{ $description }}">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    {{-- A theme picked with the switch applies before the first paint; without one, the system's is used. --}}
    <script>
        try {
            const theme = localStorage.getItem('plinth-theme');
            if (theme === 'light' || theme === 'dark') document.documentElement.dataset.theme = theme;
        } catch {}
    </script>
    @vite(['resources/css/site.css', 'resources/js/site.js'])
</head>
<body>
    <a class="site-skip-link" href="#content">Skip to content</a>

    <x-site.header :overlay="$overlay" :current="$current" />

    <main id="content" tabindex="-1">
        {{ $slot }}
    </main>

    <x-site.footer />
</body>
</html>
