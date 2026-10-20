<?php

namespace App\Components;

use Illuminate\Container\Attributes\Config;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

/**
 * Plinth's components as the site shows them: by group, each with its page (config/components.php).
 *
 * @phpstan-import-type Option from Playground
 */
final readonly class Catalogue
{
    /**
     * @param  list<string>  $groups
     * @param  array<string, array{name: string, group: string, description: string, css?: string, playground?: array{template: string, options?: array<string, Option>, states?: list<string>}}>  $components
     */
    public function __construct(
        #[Config('components.groups')] private array $groups,
        #[Config('components.components')] private array $components,
    ) {}

    /** @return Collection<int, Component> */
    public function all(): Collection
    {
        return (new Collection($this->components))
            ->map(fn (array $component, string $slug): Component => $this->component($slug, $component))
            ->sortBy(fn (Component $component): int => (int) array_search($component->group, $this->groups, true))
            ->values();
    }

    /** @return Collection<string, Collection<int, Component>> */
    public function groups(): Collection
    {
        return $this->all()->groupBy(fn (Component $component): string => $component->group);
    }

    public function find(string $slug): ?Component
    {
        return $this->all()->first(fn (Component $component): bool => $component->slug === $slug);
    }

    public function previous(Component $component): ?Component
    {
        return $this->all()->get($this->index($component) - 1);
    }

    public function next(Component $component): ?Component
    {
        return $this->all()->get($this->index($component) + 1);
    }

    private function index(Component $component): int
    {
        return (int) $this->all()->search(fn (Component $item): bool => $item->slug === $component->slug);
    }

    /** @param  array{name: string, group: string, description: string, css?: string, playground?: array{template: string, options?: array<string, Option>, states?: list<string>}}  $component */
    private function component(string $slug, array $component): Component
    {
        $studly = Str::studly($slug);
        $playground = $component['playground'] ?? null;

        return new Component(
            $slug,
            $component['name'],
            $component['group'],
            $component['description'],
            [
                'packages/css/src/components/'.($component['css'] ?? $slug).'.css',
                "packages/blade/resources/views/components/{$slug}.blade.php",
                "packages/vue/src/Plinth{$studly}.vue",
                "packages/react/src/Plinth{$studly}.tsx",
            ],
            $playground === null ? null : new Playground(
                $playground['template'],
                $playground['options'] ?? [],
                $playground['states'] ?? [],
            ),
        );
    }
}
