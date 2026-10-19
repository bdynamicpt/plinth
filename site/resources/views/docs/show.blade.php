<x-layouts.docs :link="$link" :title="$document->title" :lead="$document->lead" :headings="$document->headings" :previous="$previous" :next="$next" :edit="$edit">
    {!! $document->html !!}
</x-layouts.docs>
