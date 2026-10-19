<?php

it('builds https urls behind a proxy that says the request was https', function () {
    $this->get('/', ['X-Forwarded-Proto' => 'https', 'X-Forwarded-For' => '203.0.113.7'])
        ->assertOk()
        ->assertSee('https://localhost', false);
});
