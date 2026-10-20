<?php

namespace BDynamic\Plinth\Enums;

/** Where a drawer can rest on a phone, smallest first: a peek, half the screen, or all of it. */
enum DrawerSnap: string
{
    case Peek = 'peek';
    case Half = 'half';
    case Full = 'full';

    /**
     * The snap points from a list (of cases or values) or a string of them separated by spaces:
     * the known ones, each once, smallest first. Empty when there are none.
     *
     * @param  array<self|string>|string|null  $value
     * @return list<self>
     */
    public static function points(array|string|null $value): array
    {
        $listed = array_map(
            fn (self|string $snap) => $snap instanceof self ? $snap->value : $snap,
            is_array($value) ? $value : (preg_split('/\s+/', (string) $value) ?: []),
        );

        return array_values(array_filter(self::cases(), fn (self $snap) => in_array($snap->value, $listed, true)));
    }

    /**
     * The snap point it opens at: $snap when it is one of $points, else the largest of them; null
     * when there are none.
     *
     * @param  list<self>  $points
     */
    public static function opensAt(self|string|null $snap, array $points): ?self
    {
        $snap = $snap instanceof self ? $snap : self::tryFrom((string) $snap);

        return in_array($snap, $points, true) ? $snap : ($points === [] ? null : end($points));
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
