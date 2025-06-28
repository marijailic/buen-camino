<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/users', [UserController::class, 'store'])->name('users.store');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::apiResource('users', UserController::class)->except(['store', 'index']);

    Route::prefix('posts')->group(function () {
        Route::get('/get-by-user/{user}', [PostController::class, 'getByUser'])->name('posts.user');
    });

    Route::apiResource('posts', PostController::class)->except('index');

    Route::prefix('messages')->group(function () {
        Route::get('/get-by-receiver/{user}', [MessageController::class, 'getByReceiver'])->name('messages.receiver');
    });

    Route::apiResource('messages', MessageController::class)->except('index');
});
