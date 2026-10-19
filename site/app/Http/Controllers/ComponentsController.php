<?php

namespace App\Http\Controllers;

use App\Components\Catalogue;
use App\Components\Component;
use App\Components\Example;
use App\Components\Pages;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Illuminate\Support\HtmlString;
use Illuminate\Support\Str;

/** The components page, filtered by group, and a page per component. */
final class ComponentsController
{
    public function index(Request $request, Catalogue $catalogue): View
    {
        $groups = $catalogue->groups();
        $group = $groups->keys()->first(fn (string $name): bool => Str::slug($name) === $request->query('group'));

        return view('catalogue.index', [
            'groups' => $groups,
            'group' => $group,
            'components' => $group === null ? $catalogue->all() : $groups->get($group),
            'coming' => config()->array('components.coming'),
        ]);
    }

    public function show(string $slug, Request $request, Catalogue $catalogue, Pages $pages, Example $example): View
    {
        $component = $catalogue->find($slug);
        $document = $component === null ? null : $pages->find($slug);

        abort_if($component === null || $document === null, 404);

        $playground = null;

        if ($component->playground !== null) {
            $values = $component->playground->values($request->query());
            $blade = $component->playground->blade($values);
            $preview = $example->render($blade);
            $playground = [
                'values' => $values,
                'preview' => new HtmlString($preview),
                'tabs' => $example->tabs($blade, $preview),
            ];
        }

        $previous = $catalogue->previous($component);
        $next = $catalogue->next($component);

        return view('catalogue.show', [
            'entry' => $component,
            'document' => $document,
            'playground' => $playground,
            'nav' => $catalogue->groups()->map(fn ($items) => $items->map(fn (Component $item): array => [
                'label' => $item->name,
                'url' => $item->url(),
                'current' => $item->slug === $component->slug,
            ])),
            'previous' => $previous === null ? null : ['label' => $previous->name, 'url' => $previous->url()],
            'next' => $next === null ? null : ['label' => $next->name, 'url' => $next->url()],
            'edit' => config()->string('site.repository').'/edit/main/'.$pages->source($slug),
            'source' => config()->string('site.source'),
        ]);
    }
}
