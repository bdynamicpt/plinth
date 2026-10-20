<?php

namespace App\Search;

use App\Components\Catalogue;
use App\Components\Component;
use App\Components\Pages;
use App\Decisions\Decision;
use App\Decisions\Decisions;
use App\Docs\Document;
use App\Docs\Guides;
use App\Docs\Navigation;
use Illuminate\Support\Str;

/**
 * What the search (⌘K) looks through: every guide, component page and decision, and each of their
 * sections, in the order the groups show. A deploy writes it to public/search.json
 * (`php artisan site:search-index`); the site serves the same at /search.json when that file is
 * missing.
 */
final readonly class Index
{
    public function __construct(
        private Navigation $navigation,
        private Guides $guides,
        private Catalogue $catalogue,
        private Pages $pages,
        private Decisions $decisions,
    ) {}

    /** @return array{groups: list<string>, entries: list<Entry>} */
    public function build(): array
    {
        $entries = [
            ...$this->guides(),
            ...$this->components(),
            ...$this->decisions(),
        ];

        return [
            'groups' => array_values(array_unique(array_map(fn (Entry $entry): string => $entry->group, $entries))),
            'entries' => $entries,
        ];
    }

    /** @return list<Entry> */
    private function guides(): array
    {
        $entries = [];

        foreach ($this->navigation->sections() as $links) {
            foreach ($links as $link) {
                $url = $this->path($link->url());

                if ($link->slug === 'decisions') {
                    $entries[] = new Entry($link->section, $link->label, $url, 'Architecture decision records', '');

                    continue;
                }

                $document = $this->guides->find($link->slug);

                if ($document !== null) {
                    array_push($entries, ...$this->document($link->section, $link->label, $url, $document));
                }
            }
        }

        return $entries;
    }

    /** @return list<Entry> */
    private function components(): array
    {
        return array_values($this->catalogue->all()
            ->flatMap(function (Component $component): array {
                $document = $this->pages->find($component->slug);

                return $document === null ? [] : $this->document('Components', $component->name, $component->url(), $document, $component->description);
            })
            ->all());
    }

    /** @return list<Entry> */
    private function decisions(): array
    {
        return array_values($this->decisions->all()
            ->sortBy(fn (Decision $decision): int => $decision->number)
            ->map(function (Decision $decision): Entry {
                $document = $this->guides->render($this->decisions->markdown($decision), "docs/adr/{$decision->file}");

                return new Entry(
                    'Decisions',
                    "ADR {$decision->number}: {$decision->title}",
                    route('decisions.show', $decision->slug(), false),
                    $decision->summary ?? 'Architecture decision record',
                    $this->text($document->html),
                );
            })
            ->all());
    }

    /**
     * A page, then each of its sections (second-level headings), each with its own text.
     *
     * @return list<Entry>
     */
    private function document(string $group, string $title, string $url, Document $document, ?string $detail = null): array
    {
        $lead = $document->lead === null ? '' : $this->text($document->lead);
        $starts = [];
        $offset = 0;

        // Where each section's heading starts; a heading in a live example has more attributes.
        foreach ($document->headings as $heading) {
            $start = strpos($document->html, "<h2 id=\"{$heading['id']}\">", $offset);
            $starts[] = $offset = $start === false ? $offset : $start;
        }

        $end = fn (int $index): int => $starts[$index + 1] ?? strlen($document->html);
        $entries = [new Entry($group, $title, $url, $detail ?? Str::limit($lead, 120, preserveWords: true), $this->text($lead.' '.substr($document->html, 0, $starts[0] ?? strlen($document->html))))];

        foreach ($document->headings as $index => $heading) {
            $entries[] = new Entry($group, $heading['text'], "{$url}#{$heading['id']}", $title, $this->text(substr($document->html, $starts[$index], $end($index) - $starts[$index])));
        }

        return $entries;
    }

    /** HTML as one line of plain text. */
    private function text(string $html): string
    {
        return Str::squish(html_entity_decode(strip_tags((string) preg_replace('/<h2[^>]*>.*?<\/h2>/s', '', $html)), ENT_QUOTES | ENT_HTML5));
    }

    /** A URL as the path the site links to, so the index doesn't depend on the host that built it. */
    private function path(string $url): string
    {
        return (string) parse_url($url, PHP_URL_PATH);
    }
}
