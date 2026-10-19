<?php

$repository = 'https://github.com/bdynamicpt/plinth';

return [

    /*
    | The repository, and where its files are shown on GitHub.
    */

    'repository' => $repository,

    'source' => $repository.'/blob/main',

    /*
    | The main navigation, as paths on the site or URLs.
    */

    'nav' => [
        'Docs' => '/docs/introduction',
        'Components' => '/components',
        'Foundations' => '/docs/foundations',
        'Changelog' => $repository.'/releases',
    ],

    /*
    | The design tokens the foundations pages list: the tokens build in the repository, or the copy
    | a deploy build puts in resources/tokens.json.
    */

    'tokens' => env('SITE_TOKENS_PATH', is_file(resource_path('tokens.json'))
        ? resource_path('tokens.json')
        : base_path('../packages/tokens/dist/tokens.json')),

    /*
    | The architecture decision records: docs/adr in the repository, or the copy a deploy build
    | puts in resources/decisions, since only site/ is deployed (deploy/build.sh).
    */

    'decisions' => env('SITE_DECISIONS_PATH', is_dir(resource_path('decisions'))
        ? resource_path('decisions')
        : base_path('../docs/adr')),

];
