<?php

namespace BDynamic\Plinth;

final class Plinth
{
    /** The default typefaces: the font files and fonts/index.css with their @font-face rules. */
    public static function fontsPath(): string
    {
        return dirname(__DIR__).'/resources/dist/fonts';
    }

    /** The built stylesheet: the tokens and every component, in one file. */
    public static function cssPath(): string
    {
        return dirname(__DIR__).'/resources/dist/plinth.css';
    }
}
