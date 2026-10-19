<?php

namespace App\Decisions;

use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

/** The architecture decision records in docs/adr, newest first. */
final readonly class Decisions
{
    public function __construct(#[Config('site.decisions')] private string $path) {}

    /** @return Collection<int, Decision> */
    public function latest(int $count): Collection
    {
        return $this->all()->take($count)->values();
    }

    /** @return Collection<int, Decision> */
    public function all(): Collection
    {
        if (! File::isDirectory($this->path)) {
            return new Collection;
        }

        return (new Collection(glob($this->path.'/[0-9][0-9][0-9][0-9]-*.md') ?: []))
            ->map(fn (string $file): ?Decision => Decision::fromMarkdown(basename($file), File::get($file)))
            ->filter()
            ->sortByDesc(fn (Decision $decision): int => $decision->number)
            ->values();
    }
}
