<?php

use BDynamic\Plinth\Tests\TestCase;

pest()->extend(TestCase::class)->in('Feature');

/** Collapses whitespace between tags, so markup can be compared regardless of indentation. */
function squish(string $html): string
{
    return trim(preg_replace(['/>\s+</', '/\s+/'], ['><', ' '], $html));
}
