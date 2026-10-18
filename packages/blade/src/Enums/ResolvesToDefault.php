<?php

namespace BDynamic\Plinth\Enums;

/**
 * For the enums of a component's choices: resolve() takes a case, its value or nothing, and falls
 * back to the default for anything it doesn't know, so a component never prints an unknown value.
 */
trait ResolvesToDefault
{
    abstract public static function default(): self;

    public static function resolve(self|string|null $value): self
    {
        if ($value instanceof self) {
            return $value;
        }

        return self::tryFrom((string) $value) ?? self::default();
    }

    /** @return list<string> */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
