<?php

namespace BDynamic\Plinth\Enums;

/**
 * A callout's role: a note in the page (the default), or a message the app adds after something
 * happens, which assistive technology announces: a status, or an urgent alert.
 */
enum CalloutRole: string
{
    use ResolvesToDefault;

    case Note = 'note';
    case Status = 'status';
    case Alert = 'alert';

    public static function default(): self
    {
        return self::Note;
    }
}
