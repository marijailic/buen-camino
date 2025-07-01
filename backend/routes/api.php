<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register'])->name('register');
Route::post('/login', [AuthController::class, 'login'])->name('login');

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    Route::apiResource('users', UserController::class)->except(['store']);
    Route::post('/users/update-location', [UserController::class, 'updateLocation'])
        ->name('users.updateLocation');

    Route::get('/posts/get-by-user/{user}', [PostController::class, 'getByUser'])->name('posts.getByUser');
    Route::apiResource('posts', PostController::class)->except('index');

    Route::get('/messages/get-by-receiver/{user_id}', [MessageController::class, 'getByReceiver'])
        ->name('messages.getByReceiver');
    Route::get('/messages/get-all-receivers', [MessageController::class, 'getAllReceivers'])
        ->name('messages.getAllReceivers');
    Route::apiResource('messages', MessageController::class)->except('index');
});
