<?php

namespace App;

use Illuminate\Support\Facades\File;

/** The code examples the pages show, kept as plain files in resources/snippets. */
final class Snippets
{
    public function get(string $name): string
    {
        return rtrim(File::get(resource_path("snippets/{$name}.txt")));
    }
}
