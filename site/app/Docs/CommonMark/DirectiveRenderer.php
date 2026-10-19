<?php

namespace App\Docs\CommonMark;

use App\Docs\Tokens;
use InvalidArgumentException;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;

/** A table of tokens, or one of the live examples in resources/views/docs/examples. */
final readonly class DirectiveRenderer implements NodeRendererInterface
{
    public function __construct(private Tokens $tokens) {}

    public function render(Node $node, ChildNodeRendererInterface $childRenderer): string
    {
        $node = Nodes::expect($node, Directive::class);

        if ($node->name === 'tokens') {
            $path = preg_split('/\s+/', $node->argument) ?: [];
            $tier = array_shift($path);

            return view('docs.partials.tokens', ['tokens' => $this->tokens->group((string) $tier, ...$path)])->render();
        }

        return match ($node->argument) {
            'brand' => view('docs.examples.brand')->render(),
            'focus-ring' => view('docs.examples.focus-ring')->render(),
            default => throw new InvalidArgumentException("There is no example named {$node->argument}."),
        };
    }
}
