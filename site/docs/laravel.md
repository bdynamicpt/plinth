# Laravel and Filament

The Composer package holds the Blade components, a Filament plugin, and the built CSS and fonts,
so a Laravel app uses Plinth with no Node build.

```bash
composer require bdynamicpt/plinth
```

## In a Filament panel

Add the plugin to the panel. It registers the CSS and the fonts with Filament's asset manager.

```php label="app/Providers/Filament/AdminPanelProvider.php"
use BDynamic\Plinth\Filament\PlinthPlugin;

public function panel(Panel $panel): Panel
{
    return $panel
        // …
        ->plugin(PlinthPlugin::make());
}
```

Then publish the assets. Filament runs this on `composer update` too.

```bash
php artisan filament:assets
```

## In any Laravel app

Publish the CSS and the fonts to `public/vendor/plinth`:

```bash
php artisan vendor:publish --tag=plinth-assets
```

and link them in your layout, before your own CSS:

```blade label="resources/views/components/layouts/app.blade.php"
<link rel="stylesheet" href="{{ asset('vendor/plinth/fonts/index.css') }}">
<link rel="stylesheet" href="{{ asset('vendor/plinth/plinth.css') }}">
```

With Vite, import the files from `vendor/` in your stylesheet instead, as this site does:

```css label="resources/css/app.css"
@import url('../../vendor/bdynamicpt/plinth/resources/dist/fonts/index.css');
@import url('../../vendor/bdynamicpt/plinth/resources/dist/plinth.css');
```

## The components

Every component is an anonymous Blade component under the `plinth` namespace:

```blade
<x-plinth::badge tone="success" dot>Paid</x-plinth::badge>

<x-plinth::button variant="secondary" wire:click="save">Save draft</x-plinth::button>
```

- **Attributes reach the root.** Each component merges `$attributes` onto its documented root
  element, so `class`, `id`, `wire:*`, `x-*`, `data-*` and `aria-*` land where Livewire and
  Alpine expect them, and classes are added to Plinth's rather than replacing them.
- **Choices are enums.** Variants, tones and sizes are backed enums in
  `BDynamic\Plinth\Enums`. Pass the value as a string (`tone="success"`) or the enum case; a value
  the component doesn't know falls back to its default.
- **Behaviour is native.** A sheet is a `<dialog>`, opened with a `command` button and no script.
  Where the platform can't do something, the Blade layer adds Alpine, which Livewire and Filament
  already load.

```blade
<x-plinth::button variant="secondary" commandfor="filters" command="show-modal">Filters</x-plinth::button>

<x-plinth::sheet id="filters" title="Filters">
    …
</x-plinth::sheet>
```

## Your brand

Override the semantic tokens in a stylesheet loaded after Plinth's. See
[Branding your project](branding.md).
