<?php

namespace App\Docs\CommonMark;

use App\Components\Example;
use App\Docs\Highlighter;
use Illuminate\Support\HtmlString;
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;

/**
 * Fenced code, highlighted, in Plinth's code block; blocks with tabs share one. A Blade example is
 * rendered live above its code in every layer.
 */
final readonly class CodeRenderer implements NodeRendererInterface
{
    public function __construct(private Highlighter $highlighter, private Example $example) {}

    public function render(Node $node, ChildNodeRendererInterface $childRenderer): string
    {
        if ($node instanceof CodeTabs) {
            $fences = array_map(Fence::of(...), Nodes::only($node->children(), FencedCode::class));

            return view('docs.partials.code', [
                'label' => null,
                'html' => null,
                'tabs' => array_map(fn (Fence $fence): array => [
                    'label' => (string) $fence->tab,
                    'html' => $this->highlighter->highlight($fence->code, $fence->language),
                ], $fences),
            ])->render();
        }

        $fence = Fence::of(Nodes::expect($node, FencedCode::class));

        if ($fence->example) {
            $preview = $this->example->render($fence->code);

            return view('docs.partials.example', [
                'preview' => new HtmlString($preview),
                'tabs' => $this->example->tabs($fence->code, $preview),
                'layout' => $fence->layout,
            ])->render();
        }

        return view('docs.partials.code', [
            'label' => $fence->label,
            'html' => new HtmlString($this->highlighter->highlight($fence->code, $fence->language)),
            'tabs' => [],
        ])->render();
    }
}
