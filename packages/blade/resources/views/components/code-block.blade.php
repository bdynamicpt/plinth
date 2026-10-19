{{-- Markup contract: packages/css/src/components/code-block.css --}}
@props([
    'id' => null,
    'label' => null,
    'tabs' => [],
    'selected' => null,
    'tabsLabel' => 'Language',
    'copy' => true,
    'copyLabel' => 'Copy',
    'copiedLabel' => 'Copied',
])
@php
    $rootId = filled($id) ? trim($id) : null;
    $name = ($rootId ?? 'plinth-code-block-'.\Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8))).'-language';
    $tabs = collect($tabs)->values();
    $checked = max(0, (int) $tabs->search(fn ($tab) => $tab['label'] === $selected));
    $hasLabel = $label instanceof \Illuminate\View\ComponentSlot ? $label->hasActualContent() : filled($label);
    // What Vue and React do in the Blade layer, with Alpine: the button shows when the clipboard
    // is there, copies the code that shows, and says so for two seconds.
    $copier = '{ copyLabel: '.\Illuminate\Support\Js::from($copyLabel).', copiedLabel: '.\Illuminate\Support\Js::from($copiedLabel).', timer: 0, '
        .'async copy() { const block = this.$el.closest(\'.plinth-code-block\'); '
        .'const index = Math.max(0, [...block.querySelectorAll(\'.plinth-code-block-tab-input\')].findIndex((input) => input.checked)); '
        .'try { await navigator.clipboard.writeText(block.querySelectorAll(\'.plinth-code-block-code\')[index].textContent); } catch { return; } '
        .'this.say(this.copiedLabel, this.copiedLabel); clearTimeout(this.timer); '
        .'this.timer = setTimeout(() => this.say(this.copyLabel, \'\'), 2000); }, '
        .'say(label, status) { this.$el.querySelector(\'.plinth-button-label\').textContent = label; this.$el.nextElementSibling.textContent = status; } }';
@endphp
<div {{ $attributes->merge(array_filter(['id' => $rootId, 'class' => 'plinth-code-block'], fn ($value) => $value !== null)) }}>
    <div class="plinth-code-block-header">
        @if ($hasLabel)
            <span class="plinth-code-block-label">{{ $label }}</span>
        @endif
        @if ($tabs->isNotEmpty())
            <div class="plinth-code-block-tabs" role="radiogroup" aria-label="{{ $tabsLabel }}">
                @foreach ($tabs as $tab)
                    <label class="plinth-code-block-tab"><input type="radio" class="plinth-code-block-tab-input" name="{{ $name }}" @checked($loop->index === $checked)><span class="plinth-code-block-tab-label">{{ $tab['label'] }}</span></label>
                @endforeach
            </div>
        @endif
        @if ($copy)
            <x-plinth::button class="plinth-code-block-copy" variant="ghost" size="sm" hidden="" :x-data="$copier" x-init="$el.hidden = ! navigator.clipboard" x-on:click="copy">{{ $copyLabel }}</x-plinth::button>
            <span class="plinth-code-block-status" role="status"></span>
        @endif
    </div>
    @if ($tabs->isNotEmpty())
        @foreach ($tabs as $tab)
            <pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>{{ $tab['code'] }}</code></pre>
        @endforeach
    @else
        <pre class="plinth-code-block-code" dir="ltr" tabindex="0"><code>{{ $slot }}</code></pre>
    @endif
</div>
