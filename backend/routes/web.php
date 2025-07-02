<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Application;

Route::get('/', function () {
    return response()->json([
        'laravel_version' => Application::VERSION,
    ]);
});
