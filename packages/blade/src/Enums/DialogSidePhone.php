<?php

namespace BDynamic\Plinth\Enums;

/**
 * How a dialog shows below 768px: centred (the default, printed as no attribute) or as a bottom
 * sheet. From 768px up every dialog is centred.
 */
enum DialogSidePhone: string
{
    use ResolvesToDefault;

    case Center = 'center';
    case Bottom = 'bottom';

    public static function default(): self
    {
        return self::Center;
    }
}
