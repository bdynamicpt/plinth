<?php

namespace App\Components;

/** A Plinth component, as the site lists it (config/components.php). */
final readonly class Component
{
    /** @param  list<string>  $files  its source in the repository: the CSS, then each layer's file */
    public function __construct(
        public string $slug,
        public string $name,
        public string $group,
        public string $description,
        public array $files,
        public ?Playground $playground,
    ) {}

    public function url(): string
    {
        return route('components.show', $this->slug, false);
    }

    /** Its docs page in Storybook, which the site serves at /storybook. */
    public function stories(): string
    {
        return '/storybook/?path=/docs/components-'.$this->slug.'--docs';
    }

    /** @return list<string> */
    public function layers(): array
    {
        return ['HTML', 'Blade', 'Vue', 'React'];
    }
}
