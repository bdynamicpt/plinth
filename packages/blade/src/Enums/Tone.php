<?php

namespace BDynamic\Plinth\Enums;

/** A status tone, as on the badge. */
enum Tone: string
{
    use ResolvesToDefault;

    case Neutral = 'neutral';
    case Success = 'success';
    case Warning = 'warning';
    case Danger = 'danger';

    public static function default(): self
    {
        return self::Neutral;
    }
}
