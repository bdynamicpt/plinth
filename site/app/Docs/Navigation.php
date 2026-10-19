<?php

namespace App\Docs;

use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Collection;

/** The docs' sidebar: the pages by section (config/docs.php), and the page before and after one. */
final readonly class Navigation
{
    /** @param  array<string, array<string, string>>  $sections */
    public function __construct(#[Config('docs.sections')] private array $sections) {}

    /** @return Collection<string, Collection<int, Link>> */
    public function sections(): Collection
    {
        return (new Collection($this->sections))->map(
            fn (array $pages, string $section): Collection => (new Collection($pages))
                ->map(fn (string $label, string $slug): Link => new Link($slug, $label, $section))
                ->values(),
        );
    }

    public function find(string $slug): ?Link
    {
        return $this->links()->first(fn (Link $link): bool => $link->slug === $slug);
    }

    public function previous(string $slug): ?Link
    {
        $index = $this->links()->search(fn (Link $link): bool => $link->slug === $slug);

        return is_int($index) ? $this->links()->get($index - 1) : null;
    }

    public function next(string $slug): ?Link
    {
        $index = $this->links()->search(fn (Link $link): bool => $link->slug === $slug);

        return is_int($index) ? $this->links()->get($index + 1) : null;
    }

    /** @return Collection<int, Link> */
    private function links(): Collection
    {
        $links = [];

        foreach ($this->sections as $section => $pages) {
            foreach ($pages as $slug => $label) {
                $links[] = new Link($slug, $label, $section);
            }
        }

        return new Collection($links);
    }
}
