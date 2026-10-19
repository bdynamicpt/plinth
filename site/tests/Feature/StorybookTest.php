<?php

use Illuminate\Contracts\Http\Kernel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Symfony\Component\HttpFoundation\Response;

/** Laravel's test requests drop a trailing slash, so these go to the kernel as they arrive. */
function storybook(string $path): Response
{
    return app(Kernel::class)->handle(Request::create("http://localhost{$path}"));
}

beforeEach(function () {
    $this->public = sys_get_temp_dir().'/plinth-site-public-'.uniqid();
    $this->app->usePublicPath($this->public);
});

afterEach(function () {
    File::deleteDirectory($this->public);
});

it('adds the trailing slash Storybook needs', function () {
    $response = storybook('/storybook');

    expect($response->getStatusCode())->toBe(301)
        ->and($response->headers->get('Location'))->toBe('http://localhost/storybook/');
});

it('serves the Storybook build at /storybook/', function () {
    File::ensureDirectoryExists("{$this->public}/storybook");
    File::put("{$this->public}/storybook/index.html", '<title>Plinth Storybook</title>');

    $response = storybook('/storybook/');

    expect($response->getStatusCode())->toBe(200)
        ->and($response->getFile()->getContent())->toBe('<title>Plinth Storybook</title>');
});

it('is not found before Storybook is built', function () {
    expect(storybook('/storybook/')->getStatusCode())->toBe(404);
});
