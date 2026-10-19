<?php

namespace App\Docs;

/** A page in the docs' sidebar. */
final readonly class Link
{
    public function __construct(
        public string $slug,
        public string $label,
        public string $section,
    ) {}

    public function url(): string
    {
        return $this->slug === 'decisions' ? route('decisions.index') : route('docs.show', $this->slug);
    }

    /**
     * As the previous or next link at the foot of a page.
     *
     * @return array{label: string, url: string}
     */
    public function toPager(): array
    {
        return ['label' => $this->label, 'url' => $this->url()];
    }
}
