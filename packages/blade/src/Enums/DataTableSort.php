<?php

namespace BDynamic\Plinth\Enums;

/** A sortable data table column's state, as aria-sort takes it. */
enum DataTableSort: string
{
    use ResolvesToDefault;

    case None = 'none';
    case Ascending = 'ascending';
    case Descending = 'descending';

    public static function default(): self
    {
        return self::None;
    }
}
