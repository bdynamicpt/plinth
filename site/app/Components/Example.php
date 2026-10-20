<?php

namespace App\Components;

use App\Docs\Highlighter;
use Illuminate\Support\Facades\Blade;

/** An example written with Plinth's Blade components: rendered live, and printed in each layer. */
final readonly class Example
{
    public function __construct(
        private Markup $markup,
        private Highlighter $highlighter,
    ) {}

    public function render(string $blade): string
    {
        return Blade::render($blade);
    }

    /**
     * The example in Blade, Vue, React and HTML, highlighted, as the code block's tabs.
     *
     * @return list<array{label: string, html: string}>
     */
    public function tabs(string $blade, ?string $rendered = null): array
    {
        return [
            ['label' => 'Blade', 'html' => $this->highlighter->highlight($this->markup->blade($blade), 'blade')],
            ['label' => 'Vue', 'html' => $this->highlighter->highlight($this->markup->vue($blade), 'html')],
            ['label' => 'React', 'html' => $this->highlighter->highlight($this->markup->react($blade), 'jsx')],
            ['label' => 'HTML', 'html' => $this->highlighter->highlight($this->markup->html($rendered ?? $this->render($blade)), 'html')],
        ];
    }
}
