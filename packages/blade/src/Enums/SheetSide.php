<?php

namespace BDynamic\Plinth\Enums;

/**
 * The edge a sheet comes from: its side at every width, and optionally its side below 768px.
 * Start and end are logical, so they swap in right-to-left text.
 */
enum SheetSide: string
{
    use ResolvesToDefault;

    case Start = 'start';
    case End = 'end';
    case Top = 'top';
    case Bottom = 'bottom';

    public static function default(): self
    {
        return self::End;
    }

    /** A case, its value, or null for nothing or anything it doesn't know: an optional side. */
    public static function resolveOptional(self|string|null $value): ?self
    {
        if ($value instanceof self) {
            return $value;
        }

        return self::tryFrom((string) $value);
    }
}
