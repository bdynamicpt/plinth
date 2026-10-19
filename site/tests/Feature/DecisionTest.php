<?php

use App\Decisions\Decision;
use App\Decisions\Decisions;
use Illuminate\Support\Facades\File;

it('splits a title at its colon into a title and a summary', function () {
    $decision = Decision::fromMarkdown('0005-x.md', "# 5. Dialogs, sheets and drawers: one base, named by what they are for\n\n- Date: 2026-10-19\n");

    expect($decision)
        ->number->toBe(5)
        ->title->toBe('Dialogs, sheets and drawers')
        ->summary->toBe('One base, named by what they are for.')
        ->file->toBe('0005-x.md')
        ->and($decision?->date?->toDateString())->toBe('2026-10-19');
});

it('splits a title with no colon at its first comma', function () {
    expect(Decision::fromMarkdown('0006-x.md', '# 6. A React layer, the third thin layer'))
        ->title->toBe('A React layer')
        ->summary->toBe('The third thin layer.')
        ->date->toBeNull();
});

it('keeps a title with neither whole, with no summary', function () {
    expect(Decision::fromMarkdown('0008-x.md', '# 8. Search'))
        ->title->toBe('Search')
        ->summary->toBeNull();
});

it('skips a file with no ADR heading', function () {
    expect(Decision::fromMarkdown('0009-x.md', 'Just notes'))->toBeNull();
});

it('reads the ADRs in a directory, newest first, and skips what is not one', function () {
    $path = sys_get_temp_dir().'/plinth-site-decisions-'.uniqid();
    File::ensureDirectoryExists($path);
    File::put("{$path}/0001-first.md", '# 1. First');
    File::put("{$path}/0010-tenth.md", '# 10. Tenth');
    File::put("{$path}/0002-notes.md", 'No heading');
    File::put("{$path}/README.md", '# 99. Not an ADR file');

    $decisions = new Decisions($path);

    expect($decisions->all()->pluck('number')->all())->toBe([10, 1])
        ->and($decisions->latest(1)->pluck('title')->all())->toBe(['Tenth']);

    File::deleteDirectory($path);
});

it('has no decisions when the directory is missing', function () {
    expect((new Decisions('/nowhere'))->all())->toBeEmpty();
});
