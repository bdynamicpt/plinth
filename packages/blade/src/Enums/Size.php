<?php

namespace BDynamic\Plinth\Enums;

/**
 * One size scale for every component, icons included. Each component supports the sizes that
 * make sense for it and falls back to its default for the rest.
 */
enum Size: string
{
    use ResolvesToDefault;

    case ExtraSmall = 'xs';
    case Small = 'sm';
    case Medium = 'md';
    case Large = 'lg';
    case ExtraLarge = 'xl';

    public static function default(): self
    {
        return self::Medium;
    }

    /**
     * A case, its value or nothing, as one of the sizes a component supports (all of them when
     * none are given), or the default when it isn't one of them.
     *
     * @param  list<self>  $supported
     */
    public static function resolve(self|string|null $value, array $supported = [], ?self $default = null): self
    {
        $size = $value instanceof self ? $value : self::tryFrom((string) $value);
        $default ??= self::default();

        return $size !== null && ($supported === [] || in_array($size, $supported, true)) ? $size : $default;
    }

    /**
     * The control sizes (28, 32 and 40 px): buttons, icon buttons, inputs.
     *
     * @return list<self>
     */
    public static function controls(): array
    {
        return [self::Small, self::Medium, self::Large];
    }

    /**
     * The icon sizes (16, 20 and 24 px).
     *
     * @return list<self>
     */
    public static function icons(): array
    {
        return [self::Small, self::Medium, self::Large];
    }

    /** The size of the icons inside a control of this size. */
    public function iconSize(): self
    {
        return match ($this) {
            self::ExtraSmall, self::Small => self::Small,
            default => self::Medium,
        };
    }
}
