{{-- Markup contract: packages/css/src/components/menu-sheet.css --}}
@props([
    'id' => null,
    'title' => 'Menu',
    'closeLabel' => 'Close',
    'userName' => null,
    'userDetail' => null,
    'userSrc' => null,
    'userHref' => null,
])
@php
    $id = filled($id) ? trim($id) : 'plinth-menu-sheet-'.\Illuminate\Support\Str::lower(\Illuminate\Support\Str::random(8));
    $userHref = filled($userHref) ? $userHref : null;
@endphp
<x-plinth::sheet :attributes="$attributes->merge(['class' => 'plinth-menu-sheet'])" :id="$id" :title="$title" :close-label="$closeLabel" placement="end">
    @if (filled($userName))
        <x-plinth::list-row class="plinth-menu-sheet-user" :description="filled($userDetail) ? $userDetail : null" :href="$userHref" :chevron="$userHref !== null">
            <x-slot:leading><x-plinth::avatar :name="$userName" :src="$userSrc" size="lg" decorative /></x-slot:leading>
            {{ $userName }}
        </x-plinth::list-row>
    @endif
    <nav class="plinth-menu-sheet-nav" aria-labelledby="{{ $id }}-title">{{ $slot }}</nav>
    @if (isset($account) && $account->hasActualContent())
        <div class="plinth-menu-sheet-account">{{ $account }}</div>
    @endif
</x-plinth::sheet>
