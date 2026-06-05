<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Auth\AuthController;
use App\Http\Controllers\V1\Trainer\TrainerController;
use App\Http\Controllers\V1\Trainer\AvailabilityController;
use App\Http\Controllers\V1\Booking\BookingController;
use App\Http\Controllers\V1\Payment\PaymentController;
use App\Http\Controllers\V1\Interview\InterviewController;
use App\Http\Controllers\V1\Evaluation\EvaluationController;
use App\Http\Controllers\V1\Gamification\BadgeController;
use App\Http\Controllers\V1\Gamification\LeaderboardController;
use App\Http\Controllers\V1\Gamification\XPController;

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

    // Public Trainer Routes
    Route::get('trainers', [TrainerController::class, 'index']);
    Route::get('trainers/{id}', [TrainerController::class, 'show']);
    Route::get('trainers/{id}/availability', [AvailabilityController::class, 'getAvailability']);

    // Public Badges and Leaderboards
    Route::get('badges', [BadgeController::class, 'index']);
    Route::get('leaderboard/global', [LeaderboardController::class, 'global']);
    Route::get('leaderboard/country/{code}', [LeaderboardController::class, 'country']);
    Route::get('xp/levels', [XPController::class, 'levels']);

    // Payment Webhooks (public, no JWT required)
    Route::post('payments/sslcommerz/callback', [PaymentController::class, 'sslcommerzCallback']);
    Route::post('payments/bkash/callback', [PaymentController::class, 'bkashCallback']);

    // Authenticated Routes
    Route::middleware('auth:api')->group(function () {

        // Trainer Routes
        Route::prefix('trainers')->group(function () {
            Route::get('me', [TrainerController::class, 'me']);
            Route::put('me', [TrainerController::class, 'update']);
            Route::get('me/dashboard', [TrainerController::class, 'dashboard']);
            Route::get('me/earnings', [TrainerController::class, 'earnings']);
            Route::get('me/sessions', [TrainerController::class, 'sessions']);
            Route::post('me/availability', [AvailabilityController::class, 'setAvailability']);
            Route::post('me/evaluations/{interview_id}', [EvaluationController::class, 'store']);
        });

        // Booking Routes
        Route::prefix('bookings')->group(function () {
            Route::post('', [BookingController::class, 'store']);
            Route::get('{id}', [BookingController::class, 'show']);
            Route::delete('{id}', [BookingController::class, 'cancel']);
        });

        // Payment Routes
        Route::prefix('payments')->group(function () {
            Route::post('initiate', [PaymentController::class, 'initiate']);
            Route::get('history', [PaymentController::class, 'history']);
            Route::get('{id}/invoice', [PaymentController::class, 'invoice']);
        });

        // Interview Routes
        Route::prefix('interviews')->group(function () {
            Route::get('{id}', [InterviewController::class, 'show']);
            Route::post('{id}/join', [InterviewController::class, 'join']);
            Route::post('{id}/complete', [InterviewController::class, 'complete']);
        });

        // Gamification Routes
        Route::prefix('badges')->group(function () {
            Route::get('me', [BadgeController::class, 'myBadges']);
        });

        Route::prefix('leaderboard')->group(function () {
            Route::get('me/rank', [LeaderboardController::class, 'myRank']);
        });

        Route::prefix('xp')->group(function () {
            Route::get('progress', [XPController::class, 'myProgress']);
        });
    });
});
