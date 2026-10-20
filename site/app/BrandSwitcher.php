<?php

namespace App;

/**
 * The home page's brand switcher: the brand colours and corners a visitor can pick, and the CSS a
 * project would write for each pair. The preview takes the same declarations as its style, so
 * what the code block shows is exactly what restyles the cards.
 *
 * @phpstan-type Accent array{label: string, light: array<string, string>, dark: array<string, string>}
 * @phpstan-type Corners array{label: string, tokens: array<string, string>}
 */
final class BrandSwitcher
{
    public const string DEFAULT_ACCENT = 'blue';

    public const string DEFAULT_CORNERS = 'plinth';

    /**
     * Each colour for light and for dark: accent, hover, active, text, subtle, on-accent and the
     * focus ring. Plinth blue is Plinth's own, so it overrides nothing.
     *
     * @var array<string, Accent>
     */
    public const array ACCENTS = [
        'blue' => ['label' => 'Plinth blue', 'light' => [], 'dark' => []],
        'teal' => [
            'label' => 'Teal',
            'light' => self::LIGHT_TEAL,
            'dark' => self::DARK_TEAL,
        ],
        'ember' => [
            'label' => 'Ember',
            'light' => self::LIGHT_EMBER,
            'dark' => self::DARK_EMBER,
        ],
        'violet' => [
            'label' => 'Violet',
            'light' => self::LIGHT_VIOLET,
            'dark' => self::DARK_VIOLET,
        ],
    ];

    /** @var array<string, Corners> */
    public const array CORNERS = [
        'sharp' => ['label' => 'Sharp', 'tokens' => ['radius-control' => '0.125rem', 'radius-container' => '0.25rem', 'radius-pill' => '0.25rem']],
        'plinth' => ['label' => 'Plinth', 'tokens' => []],
        'round' => ['label' => 'Round', 'tokens' => ['radius-control' => '0.75rem', 'radius-container' => '1.25rem']],
    ];

    private const array LIGHT_TEAL = [
        'accent' => 'oklch(0.52 0.1 185)',
        'accent-hover' => 'oklch(0.47 0.09 185)',
        'accent-active' => 'oklch(0.42 0.08 185)',
        'accent-text' => 'oklch(0.45 0.09 185)',
        'accent-subtle' => 'oklch(0.95 0.03 185)',
        'on-accent' => 'oklch(0.99 0 0)',
        'focus-ring' => 'oklch(0.52 0.1 185)',
    ];

    private const array DARK_TEAL = [
        'accent' => 'oklch(0.76 0.12 180)',
        'accent-hover' => 'oklch(0.81 0.1 180)',
        'accent-active' => 'oklch(0.86 0.08 180)',
        'accent-text' => 'oklch(0.82 0.1 180)',
        'accent-subtle' => 'oklch(0.3 0.05 185)',
        'on-accent' => 'oklch(0.2 0.03 185)',
        'focus-ring' => 'oklch(0.82 0.1 180)',
    ];

    private const array LIGHT_EMBER = [
        'accent' => 'oklch(0.52 0.16 42)',
        'accent-hover' => 'oklch(0.47 0.15 42)',
        'accent-active' => 'oklch(0.42 0.13 42)',
        'accent-text' => 'oklch(0.47 0.15 42)',
        'accent-subtle' => 'oklch(0.95 0.03 50)',
        'on-accent' => 'oklch(0.99 0 0)',
        'focus-ring' => 'oklch(0.52 0.16 42)',
    ];

    private const array DARK_EMBER = [
        'accent' => 'oklch(0.75 0.15 52)',
        'accent-hover' => 'oklch(0.8 0.13 52)',
        'accent-active' => 'oklch(0.85 0.11 52)',
        'accent-text' => 'oklch(0.82 0.12 52)',
        'accent-subtle' => 'oklch(0.3 0.06 45)',
        'on-accent' => 'oklch(0.2 0.03 45)',
        'focus-ring' => 'oklch(0.82 0.12 52)',
    ];

    private const array LIGHT_VIOLET = [
        'accent' => 'oklch(0.52 0.2 295)',
        'accent-hover' => 'oklch(0.47 0.19 295)',
        'accent-active' => 'oklch(0.42 0.17 295)',
        'accent-text' => 'oklch(0.48 0.19 295)',
        'accent-subtle' => 'oklch(0.95 0.03 295)',
        'on-accent' => 'oklch(0.99 0 0)',
        'focus-ring' => 'oklch(0.52 0.2 295)',
    ];

    private const array DARK_VIOLET = [
        'accent' => 'oklch(0.73 0.15 295)',
        'accent-hover' => 'oklch(0.78 0.13 295)',
        'accent-active' => 'oklch(0.83 0.11 295)',
        'accent-text' => 'oklch(0.8 0.12 295)',
        'accent-subtle' => 'oklch(0.3 0.07 295)',
        'on-accent' => 'oklch(0.2 0.03 295)',
        'focus-ring' => 'oklch(0.8 0.12 295)',
    ];

    /**
     * The custom properties a pair sets, each colour as light-dark() so it follows the theme.
     *
     * @return array<string, string>
     */
    public function declarations(string $accent, string $corners): array
    {
        $declarations = [];
        $colours = self::ACCENTS[$accent];

        foreach ($colours['light'] as $token => $light) {
            $declarations["--plinth-color-{$token}"] = "light-dark({$light}, {$colours['dark'][$token]})";
        }

        foreach (self::CORNERS[$corners]['tokens'] as $token => $value) {
            $declarations["--plinth-{$token}"] = $value;
        }

        return $declarations;
    }

    /** The CSS a project would write after Plinth's for this pair. */
    public function css(string $accent, string $corners): string
    {
        $declarations = $this->declarations($accent, $corners);

        if ($declarations === []) {
            return "/* Plinth's defaults: nothing to override. */";
        }

        $lines = array_map(fn (string $property, string $value): string => "  {$property}: {$value};", array_keys($declarations), $declarations);

        return "/* After Plinth's CSS: each colour for light and dark. */\n:root {\n".implode("\n", $lines)."\n}";
    }

    /** The preview's style attribute for this pair. */
    public function style(string $accent, string $corners): string
    {
        $declarations = $this->declarations($accent, $corners);

        return implode(' ', array_map(fn (string $property, string $value): string => "{$property}: {$value};", array_keys($declarations), $declarations));
    }

    /**
     * Every pair, keyed "accent corners", with its CSS and style, for the Alpine component.
     *
     * @return array<string, array{css: string, style: string}>
     */
    public function pairs(): array
    {
        $pairs = [];

        foreach (array_keys(self::ACCENTS) as $accent) {
            foreach (array_keys(self::CORNERS) as $corners) {
                $pairs["{$accent} {$corners}"] = ['css' => $this->css($accent, $corners), 'style' => $this->style($accent, $corners)];
            }
        }

        return $pairs;
    }

    /**
     * Each accent's swatch: the colour for light and dark, or Plinth's own for its default.
     *
     * @return array<string, string>
     */
    public function swatches(): array
    {
        return array_map(
            fn (array $accent): string => $accent['light'] === [] ? 'var(--plinth-color-accent)' : "light-dark({$accent['light']['accent']}, {$accent['dark']['accent']})",
            self::ACCENTS,
        );
    }
}
