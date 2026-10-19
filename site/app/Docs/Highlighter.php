<?php

namespace App\Docs;

use Phiki\Phiki;
use Phiki\Token\HighlightedToken;

/**
 * Highlights code on the server with Phiki. Its theme (resources/highlight/plinth.json) names a
 * kind of token instead of a colour, printed as a site-code-* class, so the colours are Plinth's
 * tokens and follow light and dark. The result is the markup that goes inside the code block's
 * <code>.
 */
final class Highlighter
{
    /** The fence languages the docs use, as Phiki names their grammars. */
    private const array LANGUAGES = [
        'bash' => 'shellscript',
        'sh' => 'shellscript',
        'shell' => 'shellscript',
        'blade' => 'blade',
        'css' => 'css',
        'html' => 'html',
        'js' => 'javascript',
        'json' => 'json',
        'jsx' => 'jsx',
        'php' => 'php',
        'ts' => 'typescript',
        'tsx' => 'tsx',
        'vue' => 'vue',
    ];

    private const array KINDS = ['comment', 'string', 'keyword', 'property', 'constant'];

    private ?Phiki $phiki = null;

    public function highlight(string $code, ?string $language): string
    {
        $grammar = self::LANGUAGES[strtolower((string) $language)] ?? null;

        if ($grammar === null) {
            return e($code);
        }

        /** @var list<list<HighlightedToken>> $lines */
        $lines = $this->phiki()->codeToHighlightedTokens($code, $grammar, 'plinth');

        return implode("\n", array_map($this->line(...), $lines));
    }

    /** @param  list<HighlightedToken>  $tokens */
    private function line(array $tokens): string
    {
        $html = '';
        $open = null;

        foreach ($tokens as $token) {
            $text = rtrim($token->token->text, "\n");
            $foreground = $token->settings['default']->foreground ?? null;
            // Spaces join the span before them, so a run of one kind stays one span.
            $kind = trim($text) === '' ? $open : (in_array($foreground, self::KINDS, true) ? $foreground : null);

            if ($kind !== $open) {
                $html .= ($open === null ? '' : '</span>').($kind === null ? '' : '<span class="site-code-'.$kind.'">');
                $open = $kind;
            }

            $html .= e($text);
        }

        return $html.($open === null ? '' : '</span>');
    }

    private function phiki(): Phiki
    {
        return $this->phiki ??= (new Phiki)->theme('plinth', resource_path('highlight/plinth.json'));
    }
}
