<?php

namespace App\Docs\CommonMark;

use Illuminate\Support\HtmlString;
use League\CommonMark\Extension\Table\Table;
use League\CommonMark\Extension\Table\TableCell;
use League\CommonMark\Extension\Table\TableRow;
use League\CommonMark\Extension\Table\TableSection;
use League\CommonMark\Node\Node;
use League\CommonMark\Renderer\ChildNodeRendererInterface;
use League\CommonMark\Renderer\NodeRendererInterface;

/**
 * A Markdown table as Plinth's data table: a stack of cards on a phone, so a wide table never
 * scrolls the page sideways, and a table from 768px up. The first column is each card's title.
 */
final class TableRenderer implements NodeRendererInterface
{
    public function render(Node $node, ChildNodeRendererInterface $childRenderer): string
    {
        $node = Nodes::expect($node, Table::class);

        $head = [];
        $rows = [];

        foreach (Nodes::only($node->children(), TableSection::class) as $section) {
            foreach (Nodes::only($section->children(), TableRow::class) as $row) {
                $cells = array_map(
                    fn (TableCell $cell): HtmlString => new HtmlString($childRenderer->renderNodes($cell->children())),
                    Nodes::only($row->children(), TableCell::class),
                );

                if ($section->isHead()) {
                    $head = $cells;
                } else {
                    $rows[] = $cells;
                }
            }
        }

        return view('docs.partials.table', [
            'head' => $head,
            'labels' => array_map(fn (HtmlString $cell): string => html_entity_decode(strip_tags($cell->toHtml())), $head),
            'rows' => $rows,
        ])->render();
    }
}
