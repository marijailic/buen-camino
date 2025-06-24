<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UserController::class, 'store']);

Route::middleware('auth:sanctum')->apiResource('users', UserController::class)->except('store');
Route::middleware('auth:sanctum')->apiResource('posts', PostController::class);

Route::controller(AuthController::class)->group(function () {

    Route::post('/login', 'login')->name('login');

    Route::post('/logout', 'logout')->name('logout')
        ->middleware('auth:sanctum');

});

