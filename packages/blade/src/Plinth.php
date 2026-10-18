<?php

namespace BDynamic\Plinth;

class Plinth
{
    /** The tones a component such as the badge accepts. The first one is the default. */
    public const TONES = ['neutral', 'success', 'warning', 'danger'];

    /** The built stylesheet: the tokens and every component, in one file. */
    public static function cssPath(): string
    {
        return dirname(__DIR__).'/resources/dist/plinth.css';
    }

    /** A tone from the list, or the default when it is not one of them. */
    public static function tone(?string $tone): string
    {
        return in_array($tone, self::TONES, true) ? $tone : self::TONES[0];
    }
}
