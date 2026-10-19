{{--
    A component's page: what it is for, the playground (when it has variants, sizes or states), then
    its Markdown (site/components): the examples, the props in each layer and the accessibility notes.
--}}
<x-layouts.docs
    :title="$entry->name"
    :lead="$document->lead"
    :nav="$nav"
    :crumbs="[['label' => 'Components', 'url' => route('components.index')], ['label' => $entry->group, 'url' => null]]"
    section="Components"
    menu="Components"
    wide
    :previous="$previous"
    :next="$next"
    :edit="$edit"
>
    <x-slot:intro>
        <div class="site-component-meta">
            <span class="site-meta">{{ implode(' · ', $entry->layers()) }}</span>
            <div class="site-component-links">
                <x-plinth::button variant="secondary" size="sm" :href="$entry->stories()">Open in Storybook</x-plinth::button>
                @foreach ($entry->files as $file)
                    <x-plinth::button variant="ghost" size="sm" :href="$source.'/'.$file">{{ basename($file) }}</x-plinth::button>
                @endforeach
            </div>
        </div>

        @php
            $sections = array_merge($playground === null ? [] : [['id' => 'playground', 'text' => 'Playground']], $document->headings);
        @endphp
        @if (count($sections) > 1)
            <x-plinth::section-menu class="site-component-sections" label="On this page">
                @foreach ($sections as $item)
                    <x-plinth::section-menu-item :href="'#'.$item['id']">{{ $item['text'] }}</x-plinth::section-menu-item>
                @endforeach
            </x-plinth::section-menu>
        @endif

        @if ($playground !== null)
            @include('catalogue.playground', ['playground' => $entry->playground, ...$playground])
        @endif
    </x-slot:intro>

    {!! $document->html !!}
</x-layouts.docs>
