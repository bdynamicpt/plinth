<?php

namespace App\Docs\CommonMark;

use InvalidArgumentException;
use League\CommonMark\Node\Node;

/** The renderers' checks on the nodes they are given. */
final class Nodes
{
    /**
     * The node, if it is of the class the renderer is for.
     *
     * @template T of Node
     *
     * @param  class-string<T>  $class
     * @return T
     */
    public static function expect(Node $node, string $class): Node
    {
        if (! $node instanceof $class) {
            throw new InvalidArgumentException(sprintf('Expected %s, got %s.', $class, $node::class));
        }

        return $node;
    }

    /**
     * The nodes of a class among the given ones.
     *
     * @template T of Node
     *
     * @param  iterable<Node>  $nodes
     * @param  class-string<T>  $class
     * @return list<T>
     */
    public static function only(iterable $nodes, string $class): array
    {
        $only = [];

        foreach ($nodes as $node) {
            if ($node instanceof $class) {
                $only[] = $node;
            }
        }

        return $only;
    }
}
