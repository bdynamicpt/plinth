<?php

namespace BDynamic\Plinth\Enums;

/** The level of a component's heading, such as the list card's. */
enum HeadingLevel: string
{
    use ResolvesToDefault;

    case Two = 'h2';
    case Three = 'h3';
    case Four = 'h4';
    case Five = 'h5';
    case Six = 'h6';

    public static function default(): self
    {
        return self::Two;
    }
}
