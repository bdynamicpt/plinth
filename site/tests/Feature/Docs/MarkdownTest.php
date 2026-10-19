<?php

use App\Docs\CommonMark\Callout;
use App\Docs\CommonMark\CalloutRenderer;
use App\Docs\CommonMark\CodeRenderer;
use App\Docs\CommonMark\DirectiveRenderer;
use App\Docs\CommonMark\TableRenderer;
use App\Docs\Document;
use App\Docs\Highlighter;
use App\Docs\Links;
use App\Docs\Markdown;
use App\Docs\Tokens;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Renderer\ChildNodeRendererInterface;

function markdown(string $markdown, string $source = 'site/docs/page.md'): Document
{
    return app(Markdown::class)->render($markdown, $source);
}

it('takes the first heading as the title and the paragraph after it as the lead', function () {
    $document = markdown("# A *page*\n\nThe **lead**.\n\nThe body.\n");

    expect($document->title)->toBe('A page')
        ->and($document->lead)->toBe('The <strong>lead</strong>.')
        ->and($document->html)->toContain('<p>The body.</p>')
        ->not->toContain('<h1')
        ->not->toContain('lead');
});

it('has no lead when the title is not followed by a paragraph, and no title without a heading', function () {
    expect(markdown("# Title\n\n- A list\n"))->title->toBe('Title')->lead->toBeNull()
        ->and(markdown('Just text.'))->title->toBe('')->lead->toBeNull();
});

it('gives every heading an id and lists the second-level ones', function () {
    $document = markdown("# T\n\n## Install `it`\n\n### Detail\n\n## Install it\n\n## ?\n");

    expect($document->headings)->toBe([
        ['id' => 'install-it', 'text' => 'Install it'],
        ['id' => 'install-it-2', 'text' => 'Install it'],
        ['id' => 'section', 'text' => '?'],
    ])->and($document->html)->toContain('<h3 id="detail">');
});

it('prints fenced code in Plinth\'s code block, highlighted, with its label', function () {
    $html = markdown("```css label=\"brand.css\"\n:root { --plinth-radius-pill: 0.25rem; } /* note */\n```\n\n```\nplain <text>\n```\n\n```bash\nnpm install\n```\n")->html;

    expect($html)
        ->toContain('<span class="plinth-code-block-label">brand.css</span>')
        ->toContain('<span class="site-code-comment">/* note */</span>')
        ->toContain('plain &lt;text&gt;')
        ->toContain('<span class="plinth-code-block-label">Terminal</span>');
});

it('joins code blocks in a row that name a tab into one block with tabs', function () {
    $html = markdown("```blade tab=\"Blade\"\n<x-plinth::badge />\n```\n\n```vue tab=\"Vue\"\n<PlinthBadge />\n```\n\nBetween.\n\n```html tab=\"HTML\"\n<span></span>\n```\n")->html;

    expect(substr_count($html, 'class="plinth-code-block"'))->toBe(2)
        ->and(substr_count($html, 'plinth-code-block-tab-label'))->toBe(3)
        ->and($html)->toContain('>Blade</span>')->toContain('>Vue</span>')->toContain('>HTML</span>');
});

it('turns GitHub alerts into Plinth\'s callout, titled by their kind', function () {
    $html = markdown("> [!WARNING]\n> Never *primitives*.\n\n> [!TIP]\n>\n> Second paragraph.\n\n> [!NOTE]\n\n> [!NOPE]\n> Stays a quote.\n\n> **Bold** first line\n> Stays a quote too.\n")->html;

    expect($html)
        ->toContain('data-tone="warning"')->toContain('<p class="plinth-callout-title">Warning</p>')
        ->toContain('Never <em>primitives</em>.')
        ->toContain('data-tone="success"')->toContain('Second paragraph.')
        ->toContain('data-tone="info"')
        ->toContain("<blockquote>\n<p>[!NOPE]")
        ->toContain('<strong>Bold</strong> first line');
});

it('prints Markdown tables as Plinth\'s data table, the first column as the title', function () {
    $html = markdown("| Tier | Example |\n| --- | --- |\n| Semantic | `--plinth-color-surface` |\n")->html;

    expect($html)
        ->toContain('class="plinth-data-table site-docs-table"')
        ->toContain('<th class="plinth-data-table-column" role="columnheader" scope="col">Tier</th>')
        ->toContain('data-kind="title"')
        ->toContain('<span class="plinth-data-table-label" aria-hidden="true">Example</span>');
});

it('prints a table of tokens and a live example where the Markdown asks for them', function () {
    config(['site.tokens' => fixtureTokens()]);
    app()->forgetInstance(Tokens::class);

    $html = markdown("<!-- tokens: semantic color -->\n\n<!-- example: brand -->\n\n<!-- example: focus-ring -->\n\n<!-- just a comment -->\n")->html;

    expect($html)
        ->toContain('<code>--plinth-color-surface</code>')
        ->toContain('class="site-example site-brand-cards"')
        ->toContain('A secondary button')
        ->not->toContain('just a comment');
});

it('refuses an example it does not have', function () {
    markdown('<!-- example: missing -->');
})->throws(InvalidArgumentException::class, 'There is no example named missing.');

it('makes repository links the site\'s, so the Markdown works on GitHub too', function () {
    $html = markdown('[a](colour.md#light) [b](../../docs/adr/0003-visual-direction.md) [c](../../README.md) [d](https://example.com) [e](#here) [f](/storybook/)')->html;

    expect($html)
        ->toContain('href="/docs/colour#light"')
        ->toContain('href="/docs/decisions/0003-visual-direction"')
        ->toContain('href="https://github.com/bdynamicpt/plinth/blob/main/README.md"')
        ->toContain('href="https://example.com"')
        ->toContain('href="#here"')
        ->toContain('href="/storybook/"');
});

it('resolves links from where the file is in the repository', function () {
    expect(markdown('[a](site/docs/vue.md) [b](docs/adr/0001-x.md) [c](./stylelint.config.js) [d](a/../../b.md)', 'CONTRIBUTING.md')->html)
        ->toContain('href="/docs/vue"')
        ->toContain('href="/docs/decisions/0001-x"')
        ->toContain('/blob/main/stylelint.config.js"')
        ->toContain('/blob/main/b.md"')
        ->and(app(Links::class)->resolve('', 'x.md'))->toBe('');
});

it('highlights the languages the docs use, and leaves others as text', function () {
    $highlighter = new Highlighter;

    expect($highlighter->highlight("<x-plinth::badge tone=\"success\" />\n{{-- a note --}}", 'blade'))
        ->toContain('<span class="site-code-keyword">x-plinth::badge </span>')
        ->toContain('<span class="site-code-string">&quot;success&quot;</span>')
        ->and($highlighter->highlight('<b>', 'text'))->toBe('&lt;b&gt;')
        ->and($highlighter->highlight('<b>', null))->toBe('&lt;b&gt;');
});

it('refuses a node its renderer is not for', function (string $renderer) {
    app($renderer)->render(new Paragraph, new class implements ChildNodeRendererInterface
    {
        public function renderNodes(iterable $nodes): string
        {
            return '';
        }

        public function getBlockSeparator(): string
        {
            return "\n";
        }

        public function getInnerSeparator(): string
        {
            return "\n";
        }
    });
})->with([CalloutRenderer::class, CodeRenderer::class, DirectiveRenderer::class, TableRenderer::class])
    ->throws(InvalidArgumentException::class, 'Expected');

it('keeps a callout\'s tone and title', function () {
    expect(new Callout('info', 'Note'))->tone->toBe('info')->title->toBe('Note');
});
