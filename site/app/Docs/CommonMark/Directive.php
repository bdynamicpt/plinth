<?php

namespace App\Docs\CommonMark;

use League\CommonMark\Node\Block\AbstractBlock;

/**
 * What the site adds to a page where the Markdown has an HTML comment, which GitHub hides:
 * <!-- tokens: semantic color --> for a table of tokens, <!-- example: name --> for a live example
 * (resources/views/docs/examples/name.blade.php).
 */
final class Directive extends AbstractBlock
{
    public function __construct(public readonly string $name, public readonly string $argument)
    {
        parent::__construct();
    }
}
