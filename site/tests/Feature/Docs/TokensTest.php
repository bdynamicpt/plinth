<?php

use App\Docs\Markdown;
use App\Docs\Token;
use App\Docs\Tokens;

it('reads the tokens build and groups the tokens by tier and path', function () {
    $tokens = new Tokens(fixtureTokens());

    expect($tokens->group('semantic', 'color')->pluck('name')->all())->toBe(['--plinth-color-surface'])
        ->and($tokens->group('semantic')->count())->toBe(3)
        ->and($tokens->group('primitive', 'ref', 'space')->first()?->value)->toBe('0.25rem')
        ->and($tokens->group('component')->first()?->description)->toBe('The header\'s height.');
});

it('has no tokens when the build is missing or not a list', function () {
    $file = sys_get_temp_dir().'/plinth-tokens-'.uniqid().'.json';
    file_put_contents($file, '"nope"');

    expect((new Tokens('/nowhere.json'))->group('semantic'))->toBeEmpty()
        ->and((new Tokens($file))->group('semantic'))->toBeEmpty();

    unlink($file);
});

it('reads a token, tolerating missing or odd fields', function () {
    $token = Token::fromArray(['name' => '--plinth-x', 'path' => ['x', ['odd']], 'value' => 1]);

    expect($token)
        ->name->toBe('--plinth-x')->tier->toBe('')->path->toBe(['x', ''])->value->toBe('1')
        ->dark->toBeNull()->ref->toBeNull()
        ->and($token->var())->toBe('var(--plinth-x)')
        ->and(Token::fromArray([])->path)->toBe([]);
});

it('names the primitive a value is built from by its step', function () {
    expect(Token::step('ref.color.neutral.50'))->toBe('neutral 50')
        ->and(Token::step('space.14'))->toBe('space 14')
        ->and(Token::step(null))->toBeNull();
});

it('shows rem values with their pixels', function () {
    expect(Token::fromArray(['value' => '0.875rem'])->size())->toBe('0.875rem · 14px')
        ->and(Token::fromArray(['value' => '200ms'])->size())->toBe('200ms');
});

it('knows how to preview each kind of token', function (array $token, ?string $preview) {
    expect(Token::fromArray($token)->preview())->toBe($preview);
})->with([
    'shadow' => [['type' => 'shadow', 'path' => ['elevation', '1']], 'shadow'],
    'family' => [['type' => 'fontFamily', 'path' => ['font', 'family', 'body']], 'family'],
    'weight' => [['type' => 'fontWeight', 'path' => ['font', 'weight', 'medium']], 'weight'],
    'radius' => [['type' => 'dimension', 'path' => ['ref', 'radius', '6']], 'radius'],
    'font size' => [['type' => 'dimension', 'path' => ['font', 'size', 'md']], 'size'],
    'tracking' => [['type' => 'dimension', 'path' => ['font', 'tracking', 'tight']], 'tracking'],
    'space' => [['type' => 'dimension', 'path' => ['space', '4']], 'bar'],
    'duration' => [['type' => 'duration', 'path' => ['duration', 'fast']], null],
]);

it('prints colours in light and dark, and other values with what they are built from', function () {
    config(['site.tokens' => fixtureTokens()]);
    app()->forgetInstance(Tokens::class);

    $html = app(Markdown::class)->render("<!-- tokens: semantic color -->\n\n<!-- tokens: semantic space -->\n\n<!-- tokens: primitive -->\n\n<!-- tokens: component -->\n\n<!-- tokens: semantic nothing -->", 'site/docs/x.md')->html;

    expect($html)
        ->toContain('>Light</th>')->toContain('>Dark</th>')
        ->toContain('--site-token-colour: oklch(0.985 0.002 260)')
        ->toContain('neutral 950')
        ->toContain('0.25rem · 4px')
        ->toContain('>Built from</th>')
        ->toContain('data-preview="bar"')
        ->toContain('The header&#039;s height.')
        ->and(substr_count($html, 'class="plinth-data-table site-docs-table site-tokens"'))->toBe(4);
});
