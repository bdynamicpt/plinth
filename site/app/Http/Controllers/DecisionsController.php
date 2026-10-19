<?php

namespace App\Http\Controllers;

use App\Decisions\Decision;
use App\Decisions\Decisions;
use App\Docs\Guides;
use App\Docs\Navigation;
use Illuminate\Contracts\View\View;

/** The architecture decision records in docs/adr: the list, and each one as a page. */
final class DecisionsController
{
    public function index(Decisions $decisions, Navigation $navigation): View
    {
        return view('docs.decisions', [
            'link' => $navigation->find('decisions'),
            'decisions' => $decisions->all(),
            'previous' => $navigation->previous('decisions')?->toPager(),
            'next' => $decisions->all()->last()?->toPager(),
        ]);
    }

    public function show(string $slug, Decisions $decisions, Guides $guides, Navigation $navigation): View
    {
        $decision = $decisions->find($slug);

        abort_if($decision === null, 404);

        $all = $decisions->all()->sortBy(fn (Decision $decision): int => $decision->number)->values();
        $index = (int) $all->search(fn (Decision $other): bool => $other->number === $decision->number);

        return view('docs.decision', [
            'link' => $navigation->find('decisions'),
            'decision' => $decision,
            'document' => $guides->render($decisions->markdown($decision), "docs/adr/{$decision->file}"),
            'previous' => $all->get($index - 1)?->toPager() ?? $navigation->find('decisions')?->toPager(),
            'next' => $all->get($index + 1)?->toPager(),
            'edit' => config()->string('site.repository')."/edit/main/docs/adr/{$decision->file}",
        ]);
    }
}
