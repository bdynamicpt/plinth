<?php

namespace BDynamic\Plinth\Support;

final class Initials
{
    /**
     * The first letter of the first and the last word, upper case. The Vue layer's initialsFrom()
     * does the same; the parity tests compare them.
     */
    public static function from(?string $name): string
    {
        $words = preg_split('/\s+/u', trim((string) $name), -1, PREG_SPLIT_NO_EMPTY) ?: [];
        if ($words === []) {
            return '';
        }

        $first = mb_substr($words[0], 0, 1);
        $last = count($words) > 1 ? mb_substr(end($words), 0, 1) : '';

        return mb_strtoupper($first.$last);
    }
}
