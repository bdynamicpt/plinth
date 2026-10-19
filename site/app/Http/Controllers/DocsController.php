<?php

namespace App\Http\Controllers;

use App\Docs\Guides;
use App\Docs\Navigation;
use Illuminate\Contracts\View\View;

/** A guide from site/docs. */
final class DocsController
{
    public function __invoke(string $slug, Guides $guides, Navigation $navigation): View
    {
        $link = $navigation->find($slug);
        $document = $link === null ? null : $guides->find($slug);

        abort_if($link === null || $document === null, 404);

        return view('docs.show', [
            'link' => $link,
            'document' => $document,
            'previous' => $navigation->previous($slug)?->toPager(),
            'next' => $navigation->next($slug)?->toPager(),
            'edit' => config()->string('site.repository').'/edit/main/'.$guides->source($slug),
        ]);
    }
}
