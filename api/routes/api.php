<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Auth\AuthController;

Route::prefix('v1')->group(function () {

    // Public Auth Routes
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);
        Route::post('verify-email', [AuthController::class, 'verifyEmail']);
        Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('reset-password', [AuthController::class, 'resetPassword']);
        Route::post('google', [AuthController::class, 'googleLogin']);
        Route::post('refresh', [AuthController::class, 'refresh']);
    });

    // TODO: Public leaderboard, trainer list, badge list routes

    // TODO: Payment webhooks (signed, not JWT)

    // TODO: Authenticated routes group with middleware
});
