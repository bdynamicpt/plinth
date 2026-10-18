<?php

namespace BDynamic\Plinth\Enums;

/** Button heights: 28, 32 and 40 px. */
enum ButtonSize: string
{
    use ResolvesToDefault;

    case Sm = 'sm';
    case Md = 'md';
    case Lg = 'lg';

    public static function default(): self
    {
        return self::Md;
    }

    /** The size of the icons inside a button of this size. */
    public function iconSize(): IconSize
    {
        return $this === self::Sm ? IconSize::Sm : IconSize::Md;
    }
}
