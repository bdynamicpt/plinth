<?php

namespace BDynamic\Plinth\Enums;

/** What a data table cell is on a phone's card: a labelled field, the card's title, or its actions. */
enum DataTableCellKind: string
{
    use ResolvesToDefault;

    case Field = 'field';
    case Title = 'title';
    case Actions = 'actions';

    public static function default(): self
    {
        return self::Field;
    }
}
