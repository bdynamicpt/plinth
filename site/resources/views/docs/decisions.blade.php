<x-layouts.docs :link="$link" title="Decisions" lead="Each choice that shapes Plinth is an architecture decision record (ADR) in the repository's docs/adr: what was decided, why, and what follows from it. Newest first." :previous="$previous" :next="$next" :edit="null">
    @if ($decisions->isNotEmpty())
        <x-site.decisions :decisions="$decisions" />
    @else
        <p>The decisions are not here yet.</p>
    @endif
</x-layouts.docs>
