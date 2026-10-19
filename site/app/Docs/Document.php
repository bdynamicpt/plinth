<?php

namespace App\Docs;

/** A Markdown page, rendered: its title, its lead paragraph, its body and its table of contents. */
final readonly class Document
{
    /** @param  list<array{id: string, text: string}>  $headings  the second-level headings, in order */
    public function __construct(
        public string $title,
        public ?string $lead,
        public string $html,
        public array $headings,
    ) {}
}
