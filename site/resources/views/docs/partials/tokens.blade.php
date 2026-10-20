{{-- A table of design tokens from the tokens build: each name with what it is for, colours in light and dark, other values with what they are built from and a preview. --}}
@php
    $colour = $tokens->every(fn ($token) => $token->type === 'color');
    $themed = $tokens->contains(fn ($token) => $token->dark !== null);
    $built = ! $colour && $tokens->contains(fn ($token) => $token->ref !== null);
    $previewed = $tokens->contains(fn ($token) => $token->preview() !== null);
@endphp
@if ($tokens->isNotEmpty())
    <x-plinth::data-table class="site-docs-table site-tokens">
        <x-slot:head>
            <x-plinth::data-table-column>Token</x-plinth::data-table-column>
            @if ($themed)
                <x-plinth::data-table-column>Light</x-plinth::data-table-column>
                <x-plinth::data-table-column>Dark</x-plinth::data-table-column>
            @else
                <x-plinth::data-table-column>Value</x-plinth::data-table-column>
            @endif
            @if ($built)
                <x-plinth::data-table-column>Built from</x-plinth::data-table-column>
            @endif
            @if ($previewed)
                <x-plinth::data-table-column hide-on-phone>Preview</x-plinth::data-table-column>
            @endif
        </x-slot:head>
        @foreach ($tokens as $token)
            <x-plinth::data-table-row>
                <x-plinth::data-table-cell kind="title">
                    <span class="site-token-name">
                        <code>{{ $token->name }}</code>
                        @if ($token->description !== null)
                            <span class="site-token-description">{{ $token->description }}</span>
                        @endif
                    </span>
                </x-plinth::data-table-cell>
                @if ($themed)
                    @foreach (['Light' => [$token->value, $token->ref], 'Dark' => [$token->dark ?? $token->value, $token->darkRef ?? $token->ref]] as $theme => [$value, $ref])
                        <x-plinth::data-table-cell :label="$theme">
                            <span class="site-token-value">
                                @if ($colour)
                                    <span class="site-token-swatch" style="--site-token-colour: {{ $value }}" aria-hidden="true"></span>
                                @endif
                                {{ \App\Docs\Token::step($ref) ?? \App\Docs\Token::tint($value) ?? $value }}
                            </span>
                        </x-plinth::data-table-cell>
                    @endforeach
                @else
                    <x-plinth::data-table-cell label="Value">
                        <span class="site-token-value">
                            @if ($colour)
                                <span class="site-token-swatch" style="--site-token-colour: {{ $token->value }}" aria-hidden="true"></span>
                            @endif
                            {{ $token->size() }}
                        </span>
                    </x-plinth::data-table-cell>
                @endif
                @if ($built)
                    <x-plinth::data-table-cell label="Built from">{{ \App\Docs\Token::step($token->ref) ?? '' }}</x-plinth::data-table-cell>
                @endif
                @if ($previewed)
                    <x-plinth::data-table-cell hide-on-phone>
                        @if ($token->preview() !== null)
                            <span class="site-token-preview" data-preview="{{ $token->preview() }}" style="--site-token: {{ $token->var() }}" aria-hidden="true">@if (in_array($token->preview(), ['size', 'family', 'weight', 'tracking'], true))Plinth @endif</span>
                        @endif
                    </x-plinth::data-table-cell>
                @endif
            </x-plinth::data-table-row>
        @endforeach
    </x-plinth::data-table>
@endif
