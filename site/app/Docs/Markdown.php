<?php

namespace App\Docs;

use App\Docs\CommonMark\Callout;
use App\Docs\CommonMark\CalloutRenderer;
use App\Docs\CommonMark\CodeRenderer;
use App\Docs\CommonMark\CodeTabs;
use App\Docs\CommonMark\Directive;
use App\Docs\CommonMark\DirectiveRenderer;
use App\Docs\CommonMark\Fence;
use App\Docs\CommonMark\TableRenderer;
use Illuminate\Support\Str;
use League\CommonMark\Environment\Environment;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\CommonMark\Node\Block\BlockQuote;
use League\CommonMark\Extension\CommonMark\Node\Block\FencedCode;
use League\CommonMark\Extension\CommonMark\Node\Block\Heading;
use League\CommonMark\Extension\CommonMark\Node\Block\HtmlBlock;
use League\CommonMark\Extension\CommonMark\Node\Inline\Code;
use League\CommonMark\Extension\CommonMark\Node\Inline\Link;
use League\CommonMark\Extension\GithubFlavoredMarkdownExtension;
use League\CommonMark\Extension\Table\Table;
use League\CommonMark\Node\Block\Document as Tree;
use League\CommonMark\Node\Block\Paragraph;
use League\CommonMark\Node\Inline\Newline;
use League\CommonMark\Node\Inline\Text;
use League\CommonMark\Node\Node;
use League\CommonMark\Parser\MarkdownParser;
use League\CommonMark\Renderer\HtmlRenderer;

/**
 * Renders the docs' Markdown on the server: GitHub Flavored Markdown, with code in Plinth's code
 * block (highlighted by Phiki), alerts (> [!NOTE]) as Plinth's callout, tables as Plinth's data
 * table, ids on the headings, and links that work on GitHub turned into the site's. The first
 * heading is the page's title and the paragraph after it its lead; the layout prints both.
 */
final readonly class Markdown
{
    /** GitHub's alert types, as a callout's tone and title. */
    private const array ALERTS = [
        'NOTE' => ['info', 'Note'],
        'TIP' => ['success', 'Tip'],
        'IMPORTANT' => ['neutral', 'Important'],
        'WARNING' => ['warning', 'Warning'],
        'CAUTION' => ['danger', 'Caution'],
    ];

    private Environment $environment;

    public function __construct(Highlighter $highlighter, Tokens $tokens, private Links $links)
    {
        $code = new CodeRenderer($highlighter);

        $this->environment = (new Environment(['html_input' => 'strip', 'allow_unsafe_links' => false]))
            ->addExtension(new CommonMarkCoreExtension)
            ->addExtension(new GithubFlavoredMarkdownExtension)
            ->addRenderer(FencedCode::class, $code, 10)
            ->addRenderer(CodeTabs::class, $code)
            ->addRenderer(Callout::class, new CalloutRenderer)
            ->addRenderer(Table::class, new TableRenderer, 10)
            ->addRenderer(Directive::class, new DirectiveRenderer($tokens));
    }

    /** @param  string  $source  the file's path in the repository, which relative links start from */
    public function render(string $markdown, string $source): Document
    {
        $tree = (new MarkdownParser($this->environment))->parse($markdown);

        $title = '';
        $lead = null;
        $heading = $this->first($tree, fn (Node $node): bool => $node instanceof Heading && $node->getLevel() === 1);

        if ($heading !== null) {
            $title = $this->text($heading);
            $next = $heading->next();
            $heading->detach();

            if ($next instanceof Paragraph) {
                $lead = $next;
                $next->detach();
            }
        }

        $this->links($tree, $source);
        $this->alerts($tree);
        $this->codeTabs($tree);
        $this->directives($tree);
        $headings = $this->headings($tree);

        $renderer = new HtmlRenderer($this->environment);

        return new Document(
            $title,
            $lead === null ? null : $renderer->renderNodes($lead->children()),
            (string) $renderer->renderDocument($tree),
            $headings,
        );
    }

    private function links(Tree $tree, string $source): void
    {
        foreach ($this->all($tree, Link::class) as $link) {
            $link->setUrl($this->links->resolve($link->getUrl(), $source));
        }
    }

    /** "> [!WARNING]" on a quote's first line makes the quote a callout. */
    private function alerts(Tree $tree): void
    {
        foreach ($this->all($tree, BlockQuote::class) as $quote) {
            $paragraph = $quote->firstChild();
            $marker = $paragraph instanceof Paragraph ? $this->firstLine($paragraph) : [];
            $text = implode('', array_map(fn (Text $text): string => $text->getLiteral(), $marker));

            if (preg_match('/^\[!([A-Z]+)\]$/', trim($text), $match) !== 1 || ! isset(self::ALERTS[$match[1]])) {
                continue;
            }

            [$tone, $title] = self::ALERTS[$match[1]];
            $callout = new Callout($tone, $title);
            $end = null;

            foreach ($marker as $node) {
                $end = $node->next();
                $node->detach();
            }

            // The line break after the marker.
            $end?->detach();

            if ($paragraph instanceof Paragraph && ! $paragraph->hasChildren()) {
                $paragraph->detach();
            }

            foreach ($quote->children() as $child) {
                $callout->appendChild($child);
            }

            $quote->replaceWith($callout);
        }
    }

    /**
     * The text nodes on a paragraph's first line, when that line is only text.
     *
     * @return list<Text>
     */
    private function firstLine(Paragraph $paragraph): array
    {
        $nodes = [];

        for ($node = $paragraph->firstChild(); $node !== null && ! $node instanceof Newline; $node = $node->next()) {
            if (! $node instanceof Text) {
                return [];
            }

            $nodes[] = $node;
        }

        return $nodes;
    }

    /** Fenced code blocks in a row that each name a tab become one block with tabs. */
    private function codeTabs(Tree $tree): void
    {
        foreach ($this->all($tree, FencedCode::class) as $code) {
            if (Fence::of($code)->tab === null) {
                continue;
            }

            $previous = $code->previous();

            if ($previous instanceof CodeTabs) {
                $previous->appendChild($code);

                continue;
            }

            $tabs = new CodeTabs;
            $code->replaceWith($tabs);
            $tabs->appendChild($code);
        }
    }

    /** <!-- tokens: … --> and <!-- example: … --> comments, which GitHub hides. */
    private function directives(Tree $tree): void
    {
        foreach ($this->all($tree, HtmlBlock::class) as $html) {
            if (preg_match('/^<!--\s*(tokens|example):\s*([a-z0-9 -]+?)\s*-->$/', trim($html->getLiteral()), $match) === 1) {
                $html->replaceWith(new Directive($match[1], $match[2]));
            }
        }
    }

    /**
     * Gives every heading an id from its text, and lists the second-level ones.
     *
     * @return list<array{id: string, text: string}>
     */
    private function headings(Tree $tree): array
    {
        $used = [];
        $headings = [];

        foreach ($this->all($tree, Heading::class) as $heading) {
            $text = $this->text($heading);
            $slug = Str::slug($text) ?: 'section';
            $id = $slug;

            for ($n = 2; isset($used[$id]); $n++) {
                $id = "{$slug}-{$n}";
            }

            $used[$id] = true;
            $heading->data->set('attributes/id', $id);

            if ($heading->getLevel() === 2) {
                $headings[] = ['id' => $id, 'text' => $text];
            }
        }

        return $headings;
    }

    /** A node's text, without its markup. */
    private function text(Node $node): string
    {
        $text = '';

        foreach ($node->iterator() as $child) {
            if ($child instanceof Text || $child instanceof Code) {
                $text .= $child->getLiteral();
            }
        }

        return trim($text);
    }

    /**
     * Every node of a class, collected first so the tree can change while they are handled.
     *
     * @template T of Node
     *
     * @param  class-string<T>  $class
     * @return list<T>
     */
    private function all(Tree $tree, string $class): array
    {
        $nodes = [];

        foreach ($tree->iterator() as $node) {
            if ($node instanceof $class) {
                $nodes[] = $node;
            }
        }

        return $nodes;
    }

    /** @param  callable(Node): bool  $matches */
    private function first(Tree $tree, callable $matches): ?Node
    {
        foreach ($tree->iterator() as $node) {
            if ($matches($node)) {
                return $node;
            }
        }

        return null;
    }
}
