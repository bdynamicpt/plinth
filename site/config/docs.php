<?php

return [

    /*
    | The guides: Markdown files in site/docs, rendered on the server (ADR 7). The sidebar lists them
    | by section, in this order, which is also the order of previous and next. Decisions is the
    | list of ADRs in docs/adr.
    */

    'path' => base_path('docs'),

    /*
    | Pages whose Markdown lives elsewhere in the repository, by their path there, so it is written
    | once. They are read from the repository, or from the copy a deploy build puts in
    | resources/repository, since only site/ is deployed (deploy/build.sh).
    */

    'files' => [
        'contributing' => 'CONTRIBUTING.md',
    ],

    'repository' => env('SITE_REPOSITORY_PATH', is_dir(resource_path('repository'))
        ? resource_path('repository')
        : base_path('..')),

    'sections' => [
        'Getting started' => [
            'introduction' => 'Introduction',
            'installation' => 'Installation',
            'laravel' => 'Laravel and Filament',
            'vue' => 'Vue',
            'react' => 'React',
            'tailwind' => 'Tailwind v4',
        ],
        'Theming' => [
            'branding' => 'Branding your project',
            'dark-mode' => 'Dark mode',
            'token-tiers' => 'Token tiers',
        ],
        'Foundations' => [
            'foundations' => 'Overview',
            'colour' => 'Colour',
            'typography' => 'Typography',
            'spacing-and-sizes' => 'Spacing and sizes',
            'radii-and-elevation' => 'Radii and elevation',
            'layers-and-breakpoints' => 'Layers and breakpoints',
            'motion' => 'Motion',
            'focus-ring' => 'Focus ring',
            'component-tokens' => 'Component tokens',
        ],
        'Contributing' => [
            'contributing' => 'Component rules',
            'releases' => 'Releases',
            'decisions' => 'Decisions',
        ],
    ],

];
