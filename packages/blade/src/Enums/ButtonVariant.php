<?php

namespace BDynamic\Plinth\Enums;

/** The button's variants; the Button docs page says when to use each. */
enum ButtonVariant: string
{
    use ResolvesToDefault;

    case Primary = 'primary';
    case Accent = 'accent';
    case Secondary = 'secondary';
    case Ghost = 'ghost';
    case Danger = 'danger';
    case DangerGhost = 'danger-ghost';

    public static function default(): self
    {
        return self::Primary;
    }
}
