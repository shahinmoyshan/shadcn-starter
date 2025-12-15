<?php

use App\Http\Controllers\AuthController;
use Spark\Facades\Route;

Route::group(['path' => '/auth', 'callback' => AuthController::class, 'middleware' => ['guest']], function () {
    Route::post('/login', 'login');
});

Route::group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::post('/profile', [AuthController::class, 'profile']);
})
    ->middleware(['auth']);