{{-- The site's icons: 24 × 24 strokes in currentColor, for <x-plinth::icon> and icon buttons. --}}
@props(['name'])
<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    @switch($name)
        @case('arrow-right')
            <path d="M5 12h14M13 6l6 6-6 6"></path>
            @break
        @case('arrow-left')
            <path d="M19 12H5M11 6l-6 6 6 6"></path>
            @break
        @case('github')
            <circle cx="6" cy="5" r="2"></circle><circle cx="6" cy="19" r="2"></circle><circle cx="18" cy="7" r="2"></circle><path d="M6 7v10"></path><path d="M18 9c0 4-4 5-8 6l-2 .6"></path>
            @break
        @case('menu')
            <path d="M4 7h16M4 12h16M4 17h16"></path>
            @break
        @case('layers')
            <path d="M12 3l9 5-9 5-9-5z"></path><path d="M3 13l9 5 9-5"></path>
            @break
        @case('code')
            <path d="M16 18l6-6-6-6M8 6l-6 6 6 6"></path>
            @break
        @case('check')
            <path d="M5 12l5 5L19 7"></path>
            @break
        @case('lines')
            <path d="M4 7h16M4 12h10M4 17h7"></path>
            @break
        @case('window')
            <rect x="3" y="4" width="18" height="16" rx="2"></rect><path d="M3 9h18"></path>
            @break
        @case('download')
            <path d="M12 3v12M7 10l5 5 5-5M5 21h14"></path>
            @break
    @endswitch
</svg>
