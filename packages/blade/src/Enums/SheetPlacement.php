<?php

namespace BDynamic\Plinth\Enums;

/** Where a sheet shows from 768px up; on a phone every sheet is a bottom sheet. */
enum SheetPlacement: string
{
    use ResolvesToDefault;

    case Center = 'center';
    case End = 'end';

    public static function default(): self
    {
        return self::Center;
    }
}
