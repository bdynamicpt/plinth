<?php

namespace App\Docs\CommonMark;

use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;

/**
 * A fenced code block's info string: its language, then label="…" (a file name, say) and
 * tab="…" (its tab, when blocks in a row are one block with tabs).
 */
final readonly class Fence
{
    /** How a language is labelled when the fence names no label. */
    private const array LABELS = [
        'bash' => 'Terminal',
        'sh' => 'Terminal',
        'shell' => 'Terminal',
        'blade' => 'Blade',
        'css' => 'CSS',
        'html' => 'HTML',
        'js' => 'JavaScript',
        'json' => 'JSON',
        'jsx' => 'React',
        'php' => 'PHP',
        'ts' => 'TypeScript',
        'tsx' => 'React',
        'vue' => 'Vue',
    ];

    public function __construct(
        public ?string $language,
        public ?string $label,
        public ?string $tab,
        public string $code,
    ) {}

    public static function of(FencedCode $node): self
    {
        $info = (string) $node->getInfo();
        $language = $node->getInfoWords()[0] ?? '';
        preg_match_all('/(\w+)="([^"]*)"/', $info, $matches, PREG_SET_ORDER);
        $attributes = array_column($matches, 2, 1);
        $language = $language === '' || str_contains($language, '=') ? null : $language;

        return new self(
            $language,
            $attributes['label'] ?? ($language === null ? null : self::LABELS[$language] ?? null),
            $attributes['tab'] ?? null,
            rtrim($node->getLiteral(), "\n"),
        );
    }
}
