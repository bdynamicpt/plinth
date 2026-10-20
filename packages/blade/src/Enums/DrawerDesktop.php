<?php

namespace BDynamic\Plinth\Enums;

/**
 * The drawer's presentation from 768px up: centred like the dialog (the default), or a panel on
 * the inline-end edge like the sheet.
 */
enum DrawerDesktop: string
{
    use ResolvesToDefault;

    case Dialog = 'dialog';
    case Sheet = 'sheet';

    public static function default(): self
    {
        return self::Dialog;
    }
}
