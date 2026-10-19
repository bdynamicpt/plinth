<?php

namespace App\Docs\CommonMark;

use League\CommonMark\Node\Block\AbstractBlock;

/** Fenced code blocks in a row with a tab="…" each, printed as one code block with tabs. */
final class CodeTabs extends AbstractBlock {}
