<?php

namespace BDynamic\Plinth;

class Plinth
{
    /** The tones a component such as the badge accepts. The first one is the default. */
    public const TONES = ['neutral', 'success', 'warning', 'danger'];

    /** The icon sizes (16, 20 and 24 px). */
    public const ICON_SIZES = ['sm', 'md', 'lg'];

    /** An icon size from the list, or `md` when it is not one of them. */
    public static function iconSize(?string $size): string
    {
        return in_array($size, self::ICON_SIZES, true) ? $size : 'md';
    }

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
