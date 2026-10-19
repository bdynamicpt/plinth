<?php

namespace App\Docs;

/**
 * Turns the relative links a Markdown file has in the repository (so they work on GitHub too) into
 * the site's: a guide in site/docs or a component in site/components to its page, an ADR in
 * docs/adr to its page, and any other file to its place on GitHub. Absolute URLs, paths and anchors stay as they are. Site links are paths,
 * so a cached page doesn't hold the host it was first asked for on.
 */
final class Links
{
    /** @param  string  $source  the Markdown file's path in the repository, such as site/docs/vue.md */
    public function resolve(string $url, string $source): string
    {
        if ($url === '' || preg_match('~^([a-z][a-z0-9+.-]*:|/|#)~i', $url) === 1) {
            return $url;
        }

        [$path, $fragment] = array_pad(explode('#', $url, 2), 2, null);
        $anchor = $fragment === null ? '' : '#'.$fragment;
        $path = $this->normalise(dirname($source).'/'.$path);

        if (preg_match('~^site/docs/([a-z0-9-]+)\.md$~', $path, $match) === 1) {
            return route('docs.show', $match[1], false).$anchor;
        }

        if (preg_match('~^site/components/([a-z0-9-]+)\.md$~', $path, $match) === 1) {
            return route('components.show', $match[1], false).$anchor;
        }

        if (preg_match('~^docs/adr/(\d{4}-[a-z0-9-]+)\.md$~', $path, $match) === 1) {
            return route('decisions.show', $match[1], false).$anchor;
        }

        return config()->string('site.source').'/'.$path.$anchor;
    }

    /** a/b/../c becomes a/c; a path can't climb above the repository. */
    private function normalise(string $path): string
    {
        $segments = [];

        foreach (explode('/', $path) as $segment) {
            if ($segment === '..') {
                array_pop($segments);
            } elseif ($segment !== '.' && $segment !== '') {
                $segments[] = $segment;
            }
        }

        return implode('/', $segments);
    }
}
