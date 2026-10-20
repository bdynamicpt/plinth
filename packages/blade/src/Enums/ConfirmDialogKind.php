<?php

namespace BDynamic\Plinth\Enums;

/**
 * What a confirmation dialog asks for: only a yes (the default), a phrase typed exactly, or the
 * person's password, which the app checks.
 */
enum ConfirmDialogKind: string
{
    use ResolvesToDefault;

    case Simple = 'simple';
    case Type = 'type';
    case Password = 'password';

    public static function default(): self
    {
        return self::Simple;
    }

    /** The field's label when the app gives none; `:phrase` is where the phrase goes. */
    public function fieldLabel(): ?string
    {
        return match ($this) {
            self::Simple => null,
            self::Type => 'Type :phrase to confirm',
            self::Password => 'Password',
        };
    }
}
