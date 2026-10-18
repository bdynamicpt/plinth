<?php

namespace BDynamic\Plinth\Enums;

/** Avatar sizes: 24, 32, 40 and 56 px. */
enum AvatarSize: string
{
    use ResolvesToDefault;

    case Sm = 'sm';
    case Md = 'md';
    case Lg = 'lg';
    case Xl = 'xl';

    public static function default(): self
    {
        return self::Md;
    }
}
