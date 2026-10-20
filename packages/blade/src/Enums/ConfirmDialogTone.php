<?php

namespace BDynamic\Plinth\Enums;

/** A confirmation dialog's tone: neutral (the default, a primary confirm button) or danger. */
enum ConfirmDialogTone: string
{
    use ResolvesToDefault;

    case Neutral = 'neutral';
    case Danger = 'danger';

    public static function default(): self
    {
        return self::Neutral;
    }
}
