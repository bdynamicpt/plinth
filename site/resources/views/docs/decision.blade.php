<x-layouts.docs :link="$link" :eyebrow="'ADR '.$decision->number" :title="$decision->title" :lead="$decision->summary === null ? null : e($decision->summary)" :headings="$document->headings" :previous="$previous" :next="$next" :edit="$edit">
    {!! $document->html !!}
</x-layouts.docs>
