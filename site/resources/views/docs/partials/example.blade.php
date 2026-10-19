{{-- A live example: the real components on a stage, and their code in each layer below. --}}
<div class="site-demo">
    <div class="site-demo-stage" @if (filled($layout)) data-layout="{{ $layout }}" @endif>
        {{ $preview }}
    </div>
    <x-plinth::code-block class="site-demo-code" :tabs="$tabs" tabs-label="Markup in" />
</div>
