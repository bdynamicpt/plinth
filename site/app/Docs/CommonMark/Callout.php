<?php

namespace App\Docs\CommonMark;

use League\CommonMark\Node\Block\AbstractBlock;

/** A GitHub alert (> [!NOTE]), printed as Plinth's callout. */
final class Callout extends AbstractBlock
{
    public function __construct(public readonly string $tone, public readonly string $title)
    {
        parent::__construct();
    }
}
