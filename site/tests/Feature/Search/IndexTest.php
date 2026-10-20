<?php

use App\Search\Index;
use Illuminate\Support\Facades\File;

/** @return array<string, array{group: string, title: string, url: string, detail: string, text: string}> */
function searchEntries(): array
{
    $entries = [];

    foreach (app(Index::class)->build()['entries'] as $entry) {
        $entries[$entry->url] = $entry->jsonSerialize();
    }

    return $entries;
}

it('groups the entries by the docs sections, then the components and the decisions', function () {
    expect(app(Index::class)->build()['groups'])
        ->toBe(['Getting started', 'Theming', 'Foundations', 'Contributing', 'Components', 'Decisions']);
});

it('has every guide, with its lead, and each of its sections with its own text', function () {
    $entries = searchEntries();

    expect($entries['/docs/branding'])
        ->group->toBe('Theming')
        ->title->toBe('Branding your project')
        ->detail->toStartWith('Plinth ships a neutral, dark-first default.')
        ->and($entries['/docs/branding#override-the-semantic-tokens'])
        ->title->toBe('Override the semantic tokens')
        ->detail->toBe('Branding your project')
        ->text->not->toContain('<')
        ->and($entries['/docs/decisions'])
        ->group->toBe('Contributing')
        ->detail->toBe('Architecture decision records');
});

it('has every component page, with its description and its sections', function () {
    $entries = searchEntries();

    expect($entries['/components/button'])
        ->group->toBe('Components')
        ->title->toBe('Button')
        ->detail->toBe('Does something: saves, submits, opens a sheet. Six variants, three sizes.')
        ->and($entries['/components/button#choosing-a-variant'])
        ->detail->toBe('Button')
        ->text->toContain('danger-ghost');
});

it('has every decision, oldest first, with its summary', function () {
    $decisions = array_values(array_filter(searchEntries(), fn (array $entry): bool => $entry['group'] === 'Decisions'));

    expect($decisions[0])
        ->title->toStartWith('ADR 1: ')
        ->url->toStartWith('/docs/decisions/0001-')
        ->and($decisions[6])
        ->title->toBe('ADR 7: The Plinth website')
        ->detail->toBe('A Laravel app in the repository, built with Plinth.')
        ->text->toContain('Laravel Cloud');
});

it('splits a page at its own headings, not at a heading in an example', function () {
    config(['docs.path' => $path = sys_get_temp_dir().'/plinth-search-docs-'.uniqid()]);
    File::ensureDirectoryExists($path);
    File::put("{$path}/introduction.md", implode("\n", [
        '# Introduction',
        '',
        'The lead.',
        '',
        'Before the sections.',
        '',
        '## First',
        '',
        'One.',
        '',
        '```blade example',
        '<x-plinth::sheet id="demo" title="A sheet">Inside</x-plinth::sheet>',
        '```',
        '',
        '## Second',
        '',
        'Two.',
    ]));

    $entries = searchEntries();
    File::deleteDirectory($path);

    expect($entries['/docs/introduction'])
        ->detail->toBe('The lead.')
        ->text->toBe('The lead. Before the sections.')
        ->and($entries['/docs/introduction#first']['text'])->toContain('One.')->toContain('Inside')->not->toContain('Two.')
        ->and($entries['/docs/introduction#second']['text'])->toBe('Two.')
        ->and($entries)->not->toHaveKey('/docs/installation');
});

it('leaves out a component with no page, and gives a decision with no summary a detail', function () {
    config([
        'components.path' => sys_get_temp_dir().'/plinth-search-none',
        'site.decisions' => $path = sys_get_temp_dir().'/plinth-search-decisions-'.uniqid(),
    ]);
    File::ensureDirectoryExists($path);
    File::put("{$path}/0008-search.md", "# 8. Search\n\nText.");

    $entries = searchEntries();
    File::deleteDirectory($path);

    expect(array_filter($entries, fn (array $entry): bool => $entry['group'] === 'Components'))->toBeEmpty()
        ->and($entries['/docs/decisions/0008-search'])
        ->title->toBe('ADR 8: Search')
        ->detail->toBe('Architecture decision record');
});
