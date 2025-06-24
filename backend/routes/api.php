<?php

use App\Http\Controllers\Api\AuthController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {

    Route::post('/login', 'login')->name('login');

    Route::post('/logout', 'logout')->name('logout')
        ->middleware('auth:sanctum');

});
