<?php

namespace BDynamic\Plinth\Enums;

/** Icon sizes: 16, 20 and 24 px. */
enum IconSize: string
{
    use ResolvesToDefault;

    case Sm = 'sm';
    case Md = 'md';
    case Lg = 'lg';

    public static function default(): self
    {
        return self::Md;
    }
}
