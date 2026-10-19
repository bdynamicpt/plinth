<?php

namespace App\Decisions;

use Carbon\CarbonImmutable;

/** One architecture decision record (ADR) from docs/adr. */
final readonly class Decision
{
    public function __construct(
        public int $number,
        public string $title,
        public ?string $summary,
        public ?CarbonImmutable $date,
        public string $file,
    ) {}

    /**
     * Reads an ADR's number, title and date from its Markdown: a "# N. Title" heading and a
     * "- Date: YYYY-MM-DD" line. The title splits at its first colon, or else its first comma,
     * into a short title and a summary ("A React layer" and "The third thin layer …").
     */
    public static function fromMarkdown(string $file, string $markdown): ?self
    {
        if (preg_match('/^# (\d+)\. (.+)$/m', $markdown, $heading) !== 1) {
            return null;
        }

        $full = trim($heading[2]);
        $separator = str_contains($full, ': ') ? ': ' : ', ';
        $parts = explode($separator, $full, 2);
        $title = $parts[0];
        $summary = isset($parts[1]) ? ucfirst($parts[1]).'.' : null;

        $date = preg_match('/^- Date: (\d{4}-\d{2}-\d{2})$/m', $markdown, $match) === 1
            ? CarbonImmutable::parse($match[1])
            : null;

        return new self((int) $heading[1], $title, $summary, $date, $file);
    }
}
