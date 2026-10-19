<?php

namespace App\Components;

use App\Docs\Document;
use App\Docs\Guides;
use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Facades\File;

/** The components' pages: Markdown in site/components, rendered and cached like the guides. */
final readonly class Pages
{
    public function __construct(
        #[Config('components.path')] private string $path,
        private Guides $guides,
    ) {}

    public function find(string $slug): ?Document
    {
        $file = "{$this->path}/{$slug}.md";

        return File::isFile($file) ? $this->guides->render(File::get($file), $this->source($slug)) : null;
    }

    /** The page's file, as a path in the repository. */
    public function source(string $slug): string
    {
        return "site/components/{$slug}.md";
    }
}
