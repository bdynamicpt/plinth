<?php

namespace App\Http\Controllers;

use App\Search\Index;
use Illuminate\Http\JsonResponse;

/**
 * The search index, for when public/search.json isn't there (a deploy writes it, and the web
 * server serves that file instead): locally, and if a deploy skipped it.
 */
final class SearchController
{
    public function __invoke(Index $index): JsonResponse
    {
        return new JsonResponse($index->build(), 200, [], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    }
}
