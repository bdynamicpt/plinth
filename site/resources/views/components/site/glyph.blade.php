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
        @case('search')
            <circle cx="11" cy="11" r="6.5"></circle><path d="M16 16l4 4"></path>
            @break
        @case('alert')
            <circle cx="12" cy="12" r="9"></circle><path d="M12 7v6M12 16.5v.01"></path>
            @break
        @case('close')
            <path d="M6 6l12 12M18 6L6 18"></path>
            @break
        @case('plus')
            <path d="M12 5v14M5 12h14"></path>
            @break
        @case('more')
            <circle cx="5" cy="12" r="1"></circle><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle>
            @break
        @case('bell')
            <path d="M6 16V11a6 6 0 1 1 12 0v5l2 2H4z"></path><path d="M10 21h4"></path>
            @break
        @case('download')
            <path d="M12 3v12M7 10l5 5 5-5M5 21h14"></path>
            @break
    @endswitch
</svg>
