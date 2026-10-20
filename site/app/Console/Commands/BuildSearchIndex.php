<?php

namespace App\Console\Commands;

use App\Search\Index;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/** Writes the search index to public/search.json, for the web server to serve (deploy/build.sh). */
#[Signature('site:search-index')]
#[Description('Write the search index to public/search.json')]
final class BuildSearchIndex extends Command
{
    public function handle(Index $index): int
    {
        $index = $index->build();
        File::put(public_path('search.json'), (string) json_encode($index, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR));

        $this->components->info(count($index['entries']).' entries written to public/search.json.');

        return self::SUCCESS;
    }
}
