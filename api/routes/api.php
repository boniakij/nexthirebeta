<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Auth\AuthController;
use App\Http\Controllers\V1\Student\StudentController;
use App\Http\Controllers\V1\Company\CompanyController;
use App\Http\Controllers\V1\Trainer\TrainerController;
use App\Http\Controllers\V1\Trainer\AvailabilityController;
use App\Http\Controllers\V1\Trainer\TrainerProfileController;
use App\Http\Controllers\V1\Booking\BookingController;
use App\Http\Controllers\V1\Payment\PaymentController;
use App\Http\Controllers\V1\Interview\InterviewController;
use App\Http\Controllers\V1\Evaluation\EvaluationController;
use App\Http\Controllers\V1\Gamification\BadgeController;
use App\Http\Controllers\V1\Gamification\LeaderboardController;
use App\Http\Controllers\V1\Gamification\XPController;
use App\Http\Controllers\V1\Admin\TrainerProfileAdminController;

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

        // Protected logout route
        Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);
    });

    // Public Student Routes
    Route::get('students/{id}/public', [StudentController::class, 'publicProfile']);

    // Public Trainer Routes
    Route::get('trainers', [TrainerController::class, 'index']);
    Route::get('trainers/{id}', [TrainerController::class, 'show']);
    Route::get('trainers/{id}/availability', [AvailabilityController::class, 'getAvailability']);
    Route::get('trainers/{trainerId}/profile', [TrainerProfileController::class, 'getPublicProfile']);

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

        // Student Routes
        Route::prefix('students')->group(function () {
            Route::get('me', [StudentController::class, 'me']);
            Route::put('me', [StudentController::class, 'update']);
            Route::post('me/resume', [StudentController::class, 'uploadResume']);
            Route::get('me/dashboard', [StudentController::class, 'dashboard']);
            Route::get('me/sessions', [StudentController::class, 'sessions']);
            Route::get('me/evaluations', [StudentController::class, 'evaluations']);
            Route::get('me/badges', [StudentController::class, 'badges']);
            Route::get('me/xp-history', [StudentController::class, 'xpHistory']);
            Route::get('me/settings', [StudentController::class, 'getSettings']);
            Route::put('me/settings', [StudentController::class, 'updateSettings']);
        });

        // Company Routes
        Route::prefix('companies')->group(function () {
            Route::get('me/dashboard', [CompanyController::class, 'dashboard']);
            Route::get('me/campaigns', [CompanyController::class, 'campaigns']);
            Route::post('me/campaigns', [CompanyController::class, 'createCampaign']);
            Route::put('me/campaigns/{id}', [CompanyController::class, 'updateCampaign']);
            Route::get('me/candidates', [CompanyController::class, 'candidates']);
            Route::get('me/campaigns/{id}/candidates', [CompanyController::class, 'campaignCandidates']);
            Route::post('me/campaigns/{id}/invite', [CompanyController::class, 'inviteCandidate']);
            Route::put('me/candidates/{id}/status', [CompanyController::class, 'updateCandidateStatus']);
            Route::get('me/inbox', [CompanyController::class, 'inbox']);
            Route::post('me/inbox', [CompanyController::class, 'sendMessage']);
        });

        // Trainer Routes
        Route::prefix('trainers')->group(function () {
            Route::get('me', [TrainerController::class, 'me']);
            Route::put('me', [TrainerController::class, 'update']);
            Route::get('me/dashboard', [TrainerController::class, 'dashboard']);
            Route::get('me/earnings', [TrainerController::class, 'earnings']);
            Route::get('me/sessions', [TrainerController::class, 'sessions']);
            Route::post('me/availability', [AvailabilityController::class, 'setAvailability']);
            Route::post('me/evaluations/{interview_id}', [EvaluationController::class, 'store']);

            // Trainer Profile Routes
            Route::get('me/profile', [TrainerProfileController::class, 'getMyProfile']);
            Route::post('me/profile', [TrainerProfileController::class, 'updateProfile']);
            Route::post('me/profile/photo', [TrainerProfileController::class, 'uploadPhoto']);
            Route::post('me/profile/submit-review', [TrainerProfileController::class, 'submitForReview']);

            // Experience Routes
            Route::post('me/profile/experiences', [TrainerProfileController::class, 'addExperience']);
            Route::put('me/profile/experiences/{id}', [TrainerProfileController::class, 'updateExperience']);
            Route::delete('me/profile/experiences/{id}', [TrainerProfileController::class, 'deleteExperience']);

            // Certification Routes
            Route::post('me/profile/certifications', [TrainerProfileController::class, 'addCertification']);
            Route::put('me/profile/certifications/{id}', [TrainerProfileController::class, 'updateCertification']);
            Route::delete('me/profile/certifications/{id}', [TrainerProfileController::class, 'deleteCertification']);
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

        // Admin Routes (protected by admin middleware)
        Route::middleware('admin')->group(function () {
            Route::get('admin/trainers/pending-review', [TrainerProfileAdminController::class, 'getPendingReviews']);
            Route::patch('admin/trainers/{trainerId}/approve', [TrainerProfileAdminController::class, 'approveProfile']);
            Route::patch('admin/trainers/{trainerId}/reject', [TrainerProfileAdminController::class, 'rejectProfile']);
            Route::patch('admin/trainers/{trainerId}/suspend', [TrainerProfileAdminController::class, 'suspendProfile']);
            Route::get('admin/trainers', [TrainerProfileAdminController::class, 'listTrainerProfiles']);
        });
    });
});
