<?php

namespace BDynamic\Plinth\Enums;

/** Icon sizes: 16, 20 and 24 px. Icons have their own scale, as in Filament. */
enum IconSize: string
{
    use ResolvesToDefault;

    case Small = 'sm';
    case Medium = 'md';
    case Large = 'lg';

    public static function default(): self
    {
        return self::Medium;
    }
}
