<?php

namespace App\Docs\CommonMark;

use Illuminate\Support\HtmlString;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;

/** A GitHub alert as Plinth's callout, its title saying what kind of note it is. */
final class CalloutRenderer implements NodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): string
    {
        $node = Nodes::expect($node, Callout::class);

        return view('docs.partials.callout', [
            'tone' => $node->tone,
            'title' => $node->title,
            'html' => new HtmlString($childRenderer->renderNodes($node->children())),
        ])->render();
    }
}
