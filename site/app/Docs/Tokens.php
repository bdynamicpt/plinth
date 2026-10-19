<?php

namespace App\Docs;

use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;

/** Plinth's design tokens, from the tokens build (packages/tokens/dist/tokens.json). */
final class Tokens
{
    /** @var Collection<int, Token>|null */
    private ?Collection $all = null;

    public function __construct(#[Config('site.tokens')] private readonly string $path) {}

    /**
     * The tokens of a tier whose path starts with the given segments, in the build's order.
     *
     * @return Collection<int, Token>
     */
    public function group(string $tier, string ...$path): Collection
    {
        return $this->all()
            ->filter(fn (Token $token): bool => $token->tier === $tier && array_slice($token->path, 0, count($path)) === $path)
            ->values();
    }

    /** @return Collection<int, Token> */
    private function all(): Collection
    {
        if ($this->all !== null) {
            return $this->all;
        }

        $tokens = File::isFile($this->path) ? json_decode(File::get($this->path), true) : null;

        return $this->all = (new Collection(is_array($tokens) ? $tokens : []))
            ->filter(fn (mixed $token): bool => is_array($token))
            ->map(fn (array $token): Token => Token::fromArray($token))
            ->values();
    }
}
