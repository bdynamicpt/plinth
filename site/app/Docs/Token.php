<?php

namespace App\Docs;

/** One design token, as the tokens build writes it to tokens.json. */
final readonly class Token
{
    /** @param  list<string>  $path */
    public function __construct(
        public string $name,
        public string $tier,
        public string $type,
        public array $path,
        public string $value,
        public ?string $dark = null,
        public ?string $ref = null,
        public ?string $darkRef = null,
        public ?string $description = null,
    ) {}

    /** @param  array<mixed>  $token */
    public static function fromArray(array $token): self
    {
        $string = fn (string $key): ?string => isset($token[$key]) && is_scalar($token[$key]) ? (string) $token[$key] : null;
        $path = is_array($token['path'] ?? null) ? $token['path'] : [];

        return new self(
            (string) $string('name'),
            (string) $string('tier'),
            (string) $string('type'),
            array_values(array_map(fn (mixed $segment): string => is_scalar($segment) ? (string) $segment : '', $path)),
            (string) $string('value'),
            $string('dark'),
            $string('ref'),
            $string('darkRef'),
            $string('description'),
        );
    }

    public function var(): string
    {
        return "var({$this->name})";
    }

    /** The primitive a value is built from, as its step (ref.color.neutral.50 is neutral 50). */
    public static function step(?string $ref): ?string
    {
        if ($ref === null) {
            return null;
        }

        $segments = explode('.', $ref);

        return implode(' ', array_slice($segments, $segments[0] === 'ref' ? 2 : 0));
    }

    /** How the foundations tables show the token beside its value, if they can. */
    public function preview(): ?string
    {
        $path = $this->path[0] === 'ref' ? array_slice($this->path, 1) : $this->path;

        return match (true) {
            $this->type === 'shadow' => 'shadow',
            $this->type === 'fontFamily' => 'family',
            $this->type === 'fontWeight' => 'weight',
            $path[0] === 'radius' => 'radius',
            $path[0] === 'font' && $path[1] === 'size' => 'size',
            $path[0] === 'font' && $path[1] === 'tracking' => 'tracking',
            in_array($path[0], ['space', 'size', 'control', 'touch-target'], true) => 'bar',
            default => null,
        };
    }

    /** A rem value with its pixels beside it (0.875rem · 14px); others as they are. */
    public function size(): string
    {
        return str_ends_with($this->value, 'rem') && is_numeric($rem = substr($this->value, 0, -3))
            ? $this->value.' · '.((float) $rem * 16).'px'
            : $this->value;
    }
}
