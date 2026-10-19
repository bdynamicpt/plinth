<?php

namespace App\Docs;

use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;

/**
 * The guides: Markdown in site/docs, or elsewhere in the repository for the few pages written for
 * GitHub too (config/docs.php), rendered and cached until the file changes.
 */
final readonly class Guides
{
    /** @param  array<string, string>  $files */
    public function __construct(
        #[Config('docs.path')] private string $path,
        #[Config('docs.files')] private array $files,
        #[Config('docs.repository')] private string $repository,
        private Markdown $markdown,
    ) {}

    public function find(string $slug): ?Document
    {
        $source = $this->source($slug);
        $file = isset($this->files[$slug]) ? "{$this->repository}/{$source}" : "{$this->path}/{$slug}.md";

        if (! File::isFile($file)) {
            return null;
        }

        return $this->render(File::get($file), $source);
    }

    /** The page's file, as a path in the repository. */
    public function source(string $slug): string
    {
        return $this->files[$slug] ?? "site/docs/{$slug}.md";
    }

    /**
     * Renders Markdown from the repository, cached by its path and content and by what renders it,
     * so a change to the renderer, its views or Plinth's components shows without clearing a cache.
     */
    public function render(string $markdown, string $source): Document
    {
        return Cache::rememberForever(
            'docs:'.sha1($source."\n".$markdown."\n".$this->renderer()),
            fn (): Document => $this->markdown->render($markdown, $source),
        );
    }

    /** When the files that render a page last changed. */
    private function renderer(): string
    {
        $files = [
            ...glob(app_path('Docs/*.php')) ?: [],
            ...glob(app_path('Docs/CommonMark/*.php')) ?: [],
            ...glob(app_path('Components/*.php')) ?: [],
            ...glob(resource_path('views/components/site/*.blade.php')) ?: [],
            ...glob(resource_path('views/docs/*/*.blade.php')) ?: [],
            ...glob(resource_path('highlight/*.json')) ?: [],
            ...glob(base_path('vendor/bdynamicpt/plinth/resources/views/components/*.blade.php')) ?: [],
        ];

        return implode(',', array_map(fn (string $file): int => (int) filemtime($file), $files));
    }
}
