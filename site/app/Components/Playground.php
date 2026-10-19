<?php

namespace App\Components;

/**
 * A component's playground: its options (a variant, a size) and states (busy, disabled), and the
 * Blade they make. The page prints that Blade, renders it, and links each choice by its query
 * string, so the playground works without JavaScript.
 *
 * @phpstan-type Option array{values: list<string>, default: string, print?: array<string, string>, content?: array<string, array<string, string>>}
 */
final readonly class Playground
{
    /**
     * @param  string  $template  Blade, where {attributes} takes the options and states that are set
     * @param  array<string, Option>  $options  each value is printed as name="value", or as the option's print says;
     *                                          its content fills the template's other placeholders
     * @param  list<string>  $states
     */
    public function __construct(
        public string $template,
        public array $options,
        public array $states,
    ) {}

    /**
     * The options and states a query string asks for; anything it doesn't, or doesn't know, is the default.
     *
     * @param  array<array-key, mixed>  $query
     * @return array<string, string|bool>
     */
    public function values(array $query): array
    {
        $values = [];

        foreach ($this->options as $name => $option) {
            $value = $query[$name] ?? null;
            $values[$name] = is_string($value) && in_array($value, $option['values'], true) ? $value : $option['default'];
        }

        foreach ($this->states as $state) {
            $values[$state] = ($query[$state] ?? null) === '1';
        }

        return $values;
    }

    /**
     * The query string for these values with one changed: an option set, or a state turned over.
     *
     * @param  array<string, string|bool>  $values
     */
    public function link(array $values, string $name, ?string $value = null): string
    {
        $values[$name] = $value ?? ! $values[$name];
        $query = [];

        foreach ($values as $key => $set) {
            if ($set === true) {
                $query[$key] = '1';
            } elseif (is_string($set) && $set !== $this->options[$key]['default']) {
                $query[$key] = $set;
            }
        }

        return ($query === [] ? '?' : '?'.http_build_query($query)).'#playground';
    }

    /** @param  array<string, string|bool>  $values */
    public function blade(array $values): string
    {
        $attributes = '';
        $content = [];

        foreach ($values as $name => $value) {
            if (is_bool($value)) {
                $attributes .= $value ? " {$name}" : '';

                continue;
            }

            $option = $this->options[$name];
            $print = $option['print'][$value] ?? ($value === $option['default'] ? '' : "{$name}=\"{$value}\"");
            $attributes .= $print === '' ? '' : " {$print}";
            $content += $option['content'][$value] ?? [];
        }

        return strtr($this->template, ['{attributes}' => $attributes, ...$content]);
    }
}
