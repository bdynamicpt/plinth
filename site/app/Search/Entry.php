<?php

namespace App\Search;

use JsonSerializable;

/**
 * One result the search can show: a page, or a section of one. `detail` is the line under the
 * title; `text` is only searched, never shown.
 */
final readonly class Entry implements JsonSerializable
{
    public function __construct(
        public string $group,
        public string $title,
        public string $url,
        public string $detail,
        public string $text,
    ) {}

    /** @return array{group: string, title: string, url: string, detail: string, text: string} */
    public function jsonSerialize(): array
    {
        return [
            'group' => $this->group,
            'title' => $this->title,
            'url' => $this->url,
            'detail' => $this->detail,
            'text' => $this->text,
        ];
    }
}
