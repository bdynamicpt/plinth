<?php

namespace App\Components;

use Dom\Element;
use Dom\HTMLDocument;
use Dom\Node;
use Dom\Text;
use Illuminate\Support\Str;

/**
 * Prints an example written with Plinth's Blade components as the same example in Blade, Vue and
 * React, and prints what Blade rendered as tidy HTML. Every layer takes the same props and the
 * parity tests hold them to the same markup, so the Vue and React are a translation of the Blade
 * (a component's name, how a slot is passed, how a prop is written), not a second copy to keep up
 * to date. An SVG (or the site's glyph) prints as <svg>…</svg>: Plinth ships no icons, so it stands
 * for the project's own.
 */
final class Markup
{
    /** The HTML attributes that mean true by being there. */
    private const array BOOLEANS = ['disabled', 'hidden', 'open', 'inert', 'checked', 'required', 'readonly', 'multiple', 'selected', 'autofocus', 'popover'];

    /** HTML attributes React spells its own way. */
    private const array REACT_NAMES = ['class' => 'className', 'for' => 'htmlFor', 'tabindex' => 'tabIndex', 'readonly' => 'readOnly'];

    public function blade(string $source): string
    {
        return $this->print($this->source($source), 'blade');
    }

    public function vue(string $source): string
    {
        return $this->print($this->source($source), 'vue');
    }

    public function react(string $source): string
    {
        return $this->print($this->source($source), 'react');
    }

    /** What a Blade example rendered, without the Alpine attributes the Blade layer adds. */
    public function html(string $rendered): string
    {
        return $this->print($this->parse($rendered), 'html');
    }

    /**
     * The Plinth components an example uses, by name (button, data-table-row).
     *
     * @return list<string>
     */
    public function components(string $source): array
    {
        $names = [];

        foreach ($this->source($source)->querySelectorAll('*') as $element) {
            if (str_starts_with($element->localName, 'x-plinth::')) {
                $names[] = Str::after($element->localName, 'x-plinth::');
            }
        }

        return array_values(array_unique($names));
    }

    /** Blade source, with its self-closing components closed the way an HTML parser understands. */
    private function source(string $source): Element
    {
        $source = (string) preg_replace('~<(x-[\w.:-]+)((?:[^>"\']|"[^"]*"|\'[^\']*\')*?)\s*/>~', '<$1$2></$1>', $source);

        return $this->parse($source);
    }

    private function parse(string $html): Element
    {
        $document = HTMLDocument::createFromString('<!doctype html><html><body>'.$html.'</body></html>', LIBXML_NOERROR);

        // The parser always makes a body.
        assert($document->body !== null);

        return $document->body;
    }

    private function print(Element $root, string $dialect): string
    {
        return implode("\n", $this->lines($this->children($root), 0, $dialect));
    }

    /**
     * @param  list<Node>  $nodes
     * @return list<string>
     */
    private function lines(array $nodes, int $depth, string $dialect): array
    {
        $indent = str_repeat(' ', $depth * ($dialect === 'blade' ? 4 : 2));
        $lines = [];

        foreach ($nodes as $node) {
            if ($node instanceof Text) {
                $lines[] = $indent.$this->text($node);

                continue;
            }

            /** @var Element $node */
            $inline = $this->inline($node, $dialect);
            $children = $this->children($node);
            $elements = array_filter($children, fn (Node $child): bool => $child instanceof Element);

            if ($this->isIcon($node) || $node->localName === 'pre' || ($elements === [] && strlen($indent.$inline) <= 100) || (count($children) === 1 && strlen($indent.$inline) <= 80)) {
                $lines[] = $indent.$inline;

                continue;
            }

            [$open, $close, $children] = $this->tags($node, $dialect, $depth);
            $lines = [...$lines, ...array_map(fn (string $line): string => $indent.$line, $open)];
            $lines = [...$lines, ...$this->lines($children, $depth + 1, $dialect)];
            $lines[] = $indent.$close;
        }

        return $lines;
    }

    /** An element on one line. */
    private function inline(Node $node, string $dialect): string
    {
        if ($node instanceof Text) {
            return $this->text($node);
        }

        /** @var Element $node */
        if ($this->isIcon($node)) {
            return '<svg>…</svg>';
        }

        [$open, $close, $children] = $this->tags($node, $dialect, 0);

        // Code keeps its own lines and spaces.
        if ($node->localName === 'pre') {
            return implode(' ', $open).$node->innerHTML.$close;
        }

        $content = implode('', array_map(fn (Node $child): string => $this->inline($child, $dialect), $children));

        return $close === '' ? implode(' ', $open) : implode(' ', $open).$content.$close;
    }

    /**
     * An element's opening tag, its closing tag (empty when the opening one closes itself), and the
     * children that go between them.
     *
     * @return array{list<string>, string, list<Node>}
     */
    private function tags(Element $element, string $dialect, int $depth): array
    {
        $name = $this->name($element, $dialect);
        $attributes = $this->attributes($element, $dialect);
        $children = $this->children($element);

        // In React a component's named slots are props that take a node.
        if ($dialect === 'react') {
            foreach ($children as $index => $child) {
                if ($child instanceof Element && str_starts_with($child->localName, 'x-slot:')) {
                    $content = $this->children($child);
                    $value = count($content) === 1 && $content[0] instanceof Text
                        ? '"'.$this->text($content[0]).'"'
                        : '{'.(count($content) === 1 ? '' : '<>').implode('', array_map(fn (Node $node): string => $this->inline($node, 'react'), $content)).(count($content) === 1 ? '' : '</>').'}';
                    $attributes[] = Str::camel(Str::after($child->localName, 'x-slot:')).'='.$value;
                    unset($children[$index]);
                }
            }

            $children = array_values($children);
        }

        $void = in_array($element->localName, ['img', 'input', 'br', 'hr', 'source', 'meta', 'link'], true);
        $selfClosing = $children === [] && ($void || $dialect !== 'html' && $name !== $element->localName || str_starts_with($element->localName, 'x-'));
        $end = $selfClosing ? ($dialect === 'html' && $void ? '>' : ' />') : '>';
        $open = trim('<'.$name.' '.implode(' ', $attributes)).$end;

        return [[$open], $selfClosing ? '' : '</'.$name.'>', $children];
    }

    private function name(Element $element, string $dialect): string
    {
        $name = $element->localName;

        if ($dialect === 'blade' || $dialect === 'html') {
            return $name;
        }

        if (str_starts_with($name, 'x-plinth::')) {
            return 'Plinth'.Str::studly(Str::after($name, 'x-plinth::'));
        }

        return str_starts_with($name, 'x-slot:') ? 'template' : $name;
    }

    /** @return list<string> */
    private function attributes(Element $element, string $dialect): array
    {
        $attributes = [];
        $component = str_starts_with($element->localName, 'x-plinth::');

        if ($dialect === 'vue' && str_starts_with($element->localName, 'x-slot:')) {
            $attributes[] = '#'.Str::after($element->localName, 'x-slot:');
        }

        foreach ($element->attributes as $attribute) {
            $name = $attribute->name;
            $value = $attribute->value;

            if ($dialect === 'html' && str_starts_with($name, 'x-')) {
                continue;
            }

            $bound = str_starts_with($name, ':');

            if ($dialect === 'react') {
                $name = ltrim($name, ':');
                $name = self::REACT_NAMES[$name] ?? ($component && ! preg_match('/^(data|aria)-/', $name) ? Str::camel($name) : $name);
            }

            $attributes[] = match (true) {
                $dialect === 'html' && $value === '' && in_array($name, self::BOOLEANS, true) => $name,
                $dialect !== 'html' && $value === '' => $name,
                $dialect === 'react' && $bound => $name.'={'.$value.'}',
                default => $name.'="'.htmlspecialchars($value, ENT_COMPAT).'"',
            };
        }

        return $attributes;
    }

    /**
     * An element's children that print: elements, and text that isn't only white space.
     *
     * @return list<Node>
     */
    private function children(Node $node): array
    {
        $children = [];

        foreach ($node->childNodes as $child) {
            if ($child instanceof Element || ($child instanceof Text && trim($child->data) !== '')) {
                $children[] = $child;
            }
        }

        return $children;
    }

    private function text(Text $text): string
    {
        return htmlspecialchars(trim((string) preg_replace('/\s+/', ' ', $text->data)), ENT_NOQUOTES);
    }

    private function isIcon(Element $element): bool
    {
        return $element->localName === 'svg' || $element->localName === 'x-site.glyph';
    }
}
