<?php

$repository = 'https://github.com/bdynamicpt/plinth';

return [

    /*
    | The repository, and where its files are shown on GitHub.
    */

    'repository' => $repository,

    'source' => $repository.'/blob/main',

    /*
    | The main navigation. Docs, components and foundations point at the repository until the
    | site has those pages (#78, #79).
    */

    'nav' => [
        'Docs' => $repository.'#readme',
        'Components' => $repository.'/tree/main/packages/css/src/components',
        'Foundations' => $repository.'/blob/main/docs/adr/0003-visual-direction.md',
        'Changelog' => $repository.'/releases',
    ],

    /*
    | The components Plinth has today, as the home page lists them.
    */

    'components' => [
        'Avatar', 'Badge', 'Button', 'Callout', 'Code block', 'Data table', 'Header', 'Icon', 'Icon button', 'List card',
        'List row', 'Menu sheet', 'Pill row', 'Section menu', 'Sheet',
    ],

    /*
    | The architecture decision records: docs/adr in the repository, or the copy a deploy build
    | puts in resources/decisions, since only site/ is deployed (deploy/build.sh).
    */

    'decisions' => env('SITE_DECISIONS_PATH', is_dir(resource_path('decisions'))
        ? resource_path('decisions')
        : base_path('../docs/adr')),

];
