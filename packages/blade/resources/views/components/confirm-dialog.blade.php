{{-- Markup contract: packages/css/src/components/confirm-dialog.css --}}
@props([
    'id' => null,
    'title' => null,
    'message' => null,
    'kind' => 'simple',
    'phrase' => null,
    'fieldLabel' => null,
    'confirmLabel' => 'Confirm',
    'cancelLabel' => 'Cancel',
    'tone' => 'neutral',
    'error' => null,
    'busy' => false,
    'sidePhone' => 'center',
])
@php
    if (blank($title)) {
        throw new InvalidArgumentException('<x-plinth::confirm-dialog> needs a title: it is the dialog\'s accessible name.');
    }
    if (blank($message)) {
        throw new InvalidArgumentException('<x-plinth::confirm-dialog> needs a message: it is the dialog\'s accessible description.');
    }
    $kind = \BDynamic\Plinth\Enums\ConfirmDialogKind::resolve($kind);
    if ($kind === \BDynamic\Plinth\Enums\ConfirmDialogKind::Type && blank($phrase)) {
        throw new InvalidArgumentException('<x-plinth::confirm-dialog kind="type"> needs a phrase: it is what the person types.');
    }
    $id = filled($id) ? trim($id) : 'plinth-confirm-dialog-'.\Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
    $hasField = $kind !== \BDynamic\Plinth\Enums\ConfirmDialogKind::Simple;
    $hasError = $hasField && filled($error);
    $phrase = trim((string) $phrase);
    $label = e(filled($fieldLabel) ? trim($fieldLabel) : (string) $kind->fieldLabel());
    if ($kind === \BDynamic\Plinth\Enums\ConfirmDialogKind::Type) {
        $label = str_replace(':phrase', '<strong>'.e($phrase).'</strong>', $label);
    }
    // The phrase with the characters a pattern treats as syntax escaped, so only the phrase matches.
    $pattern = preg_replace('/[\\\\^$.*+?()[\]{}|\/]/', '\\\\$0', $phrase);
    $sidePhone = \BDynamic\Plinth\Enums\DialogSidePhone::resolve($sidePhone);
    $tone = \BDynamic\Plinth\Enums\ConfirmDialogTone::resolve($tone);
    $root = array_filter([
        'id' => $id,
        'class' => 'plinth-dialog plinth-confirm-dialog',
        'role' => 'alertdialog',
        'data-side-phone' => $sidePhone === \BDynamic\Plinth\Enums\DialogSidePhone::Center ? null : $sidePhone->value,
        'closedby' => 'closerequest',
        'aria-labelledby' => $id.'-title',
        'aria-describedby' => $id.'-message',
    ], fn ($value) => $value !== null);
@endphp
<dialog {{ $attributes->merge($root) }}>
    <form method="dialog" class="plinth-confirm-dialog-form">
        <div class="plinth-dialog-header">
            <h2 id="{{ $id }}-title" class="plinth-dialog-title">{{ $title }}</h2>
        </div>
        <div class="plinth-dialog-body">
            <p id="{{ $id }}-message" class="plinth-confirm-dialog-message">{{ $message }}</p>
            @if ($hasField)
                <div class="plinth-confirm-dialog-field">
                    <label for="{{ $id }}-field" class="plinth-confirm-dialog-label">{!! $label !!}</label>
                    @if ($kind === \BDynamic\Plinth\Enums\ConfirmDialogKind::Type)
                        <input id="{{ $id }}-field" class="plinth-confirm-dialog-input" type="text" name="confirmation" required pattern="{{ $pattern }}" autocomplete="off" autocapitalize="none" spellcheck="false" @if ($hasError) aria-invalid="true" aria-describedby="{{ $id }}-error" @endif>
                    @else
                        <input id="{{ $id }}-field" class="plinth-confirm-dialog-input" type="password" name="password" required autocomplete="current-password" @if ($hasError) aria-invalid="true" aria-describedby="{{ $id }}-error" @endif>
                    @endif
                </div>
            @endif
            @if ($hasError)
                <p id="{{ $id }}-error" class="plinth-confirm-dialog-error" role="alert">{{ $error }}</p>
            @endif
        </div>
        <div class="plinth-dialog-footer">
            <x-plinth::button variant="secondary" :commandfor="$id" command="close">{{ $cancelLabel }}</x-plinth::button>
            <x-plinth::button class="plinth-confirm-dialog-confirm" type="submit" value="confirm" :variant="$tone === \BDynamic\Plinth\Enums\ConfirmDialogTone::Danger ? 'danger' : 'primary'" :busy="$busy">{{ $confirmLabel }}</x-plinth::button>
        </div>
    </form>
</dialog>
