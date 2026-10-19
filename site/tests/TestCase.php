<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // The pages are tested without the Vite build, so the tests don't need `npm run build`.
        $this->withoutVite();
    }
}
