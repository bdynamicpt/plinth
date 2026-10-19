<?php

namespace BDynamic\Plinth\Enums;

/** A callout's tone. Each has its own icon shape, so the tone never rests on colour alone. */
enum CalloutTone: string
{
    use ResolvesToDefault;

    case Neutral = 'neutral';
    case Info = 'info';
    case Success = 'success';
    case Warning = 'warning';
    case Danger = 'danger';

    public static function default(): self
    {
        return self::Neutral;
    }

    /** The tone's icon, as Vue's and React's calloutIcons print it. */
    public function icon(): string
    {
        $paths = match ($this) {
            self::Neutral => '<rect x="5" y="4" width="14" height="16" rx="2"></rect><path d="M9 9h6M9 13h6M9 17h3"></path>',
            self::Info => '<circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 7.5v.01"></path>',
            self::Success => '<circle cx="12" cy="12" r="9"></circle><path d="M8 12.5l2.5 2.5L16 9.5"></path>',
            self::Warning => '<path d="M10.3 4.3L2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.3a2 2 0 0 0-3.4 0z"></path><path d="M12 9.5v4M12 17v.01"></path>',
            self::Danger => '<path d="M8.5 3h7L21 8.5v7L15.5 21h-7L3 15.5v-7z"></path><path d="M12 7.5v5M12 16v.01"></path>',
        };

        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'.$paths.'</svg>';
    }
}
