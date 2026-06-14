<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Trainer\TrainerProfileController;
use App\Http\Controllers\V1\Admin\TrainerProfileAdminController;

Route::middleware('auth:api')->group(function () {
    // Trainer Profile Routes
    Route::get('/trainers/me/profile', [TrainerProfileController::class, 'getMyProfile']);
    Route::post('/trainers/me/profile', [TrainerProfileController::class, 'updateProfile']);
    Route::post('/trainers/me/profile/photo', [TrainerProfileController::class, 'uploadPhoto']);
    Route::post('/trainers/me/profile/submit-review', [TrainerProfileController::class, 'submitForReview']);

    // Experience Routes
    Route::post('/trainers/me/profile/experiences', [TrainerProfileController::class, 'addExperience']);
    Route::put('/trainers/me/profile/experiences/{id}', [TrainerProfileController::class, 'updateExperience']);
    Route::delete('/trainers/me/profile/experiences/{id}', [TrainerProfileController::class, 'deleteExperience']);

    // Certification Routes
    Route::post('/trainers/me/profile/certifications', [TrainerProfileController::class, 'addCertification']);
    Route::put('/trainers/me/profile/certifications/{id}', [TrainerProfileController::class, 'updateCertification']);
    Route::delete('/trainers/me/profile/certifications/{id}', [TrainerProfileController::class, 'deleteCertification']);
});

// Public trainer profile view (no auth required)
Route::get('/trainers/{trainerId}/profile', [TrainerProfileController::class, 'getPublicProfile']);

// Admin Routes (protected by admin middleware)
Route::middleware(['auth:api', 'admin'])->group(function () {
    Route::get('/admin/trainers/pending-review', [TrainerProfileAdminController::class, 'getPendingReviews']);
    Route::patch('/admin/trainers/{trainerId}/approve', [TrainerProfileAdminController::class, 'approveProfile']);
    Route::patch('/admin/trainers/{trainerId}/reject', [TrainerProfileAdminController::class, 'rejectProfile']);
    Route::patch('/admin/trainers/{trainerId}/suspend', [TrainerProfileAdminController::class, 'suspendProfile']);
    Route::get('/admin/trainers', [TrainerProfileAdminController::class, 'listTrainerProfiles']);
});
