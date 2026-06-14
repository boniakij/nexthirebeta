<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Trainer\InterviewPackageController;

// Trainer routes (protected)
Route::middleware('auth:api')->group(function () {
    // Create package
    Route::post('/trainers/interview-packages', [InterviewPackageController::class, 'create']);
    
    // Get my packages
    Route::get('/trainers/interview-packages', [InterviewPackageController::class, 'index']);
    
    // Get specific package
    Route::get('/trainers/interview-packages/{id}', [InterviewPackageController::class, 'show']);
    
    // Update package
    Route::put('/trainers/interview-packages/{id}', [InterviewPackageController::class, 'update']);
    
    // Delete package
    Route::delete('/trainers/interview-packages/{id}', [InterviewPackageController::class, 'delete']);
});

// Student routes (public or authenticated)
Route::group(function () {
    // Get all packages with filters
    Route::get('/interview-packages', 'InterviewPackageController@getAll');
    
    // Get package details
    Route::get('/interview-packages/{id}', 'InterviewPackageController@getDetails');
    
    // Get trainer info with package
    Route::get('/interview-packages/{id}/trainer', 'InterviewPackageController@getTrainerInfo');
});

// Student authenticated routes
Route::middleware('auth:api')->group(function () {
    // Book package
    Route::post('/interview-packages/{id}/book', 'InterviewBookingController@bookPackage');
    
    // Get my bookings
    Route::get('/students/interview-bookings', 'InterviewBookingController@getMyBookings');
    
    // Cancel booking
    Route::post('/interview-bookings/{id}/cancel', 'InterviewBookingController@cancelBooking');
});
