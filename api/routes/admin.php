<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\V1\Admin\AdminController;
use App\Http\Controllers\V1\Admin\AdminUserController;
use App\Http\Controllers\V1\Admin\AdminTrainerController;
use App\Http\Controllers\V1\Admin\AdminCompanyController;
use App\Http\Controllers\V1\Admin\AdminBookingController;
use App\Http\Controllers\V1\Admin\AdminPaymentController;
use App\Http\Controllers\V1\Admin\AdminNotificationController;
use App\Http\Controllers\V1\Admin\AdminReportController;
use App\Http\Controllers\V1\Admin\AdminSettingsController;

Route::prefix('admin')->middleware('auth:api', 'admin')->group(function () {
    
    // Admin Dashboard
    Route::get('dashboard', [AdminController::class, 'index']);
    Route::get('stats', [AdminController::class, 'stats']);
    Route::get('health', [AdminController::class, 'health']);
    
    // User Management
    Route::apiResource('users', AdminUserController::class);
    Route::post('users/bulk-delete', [AdminUserController::class, 'bulkDelete']);
    
    // Trainer Management
    Route::apiResource('trainers', AdminTrainerController::class);
    Route::post('trainers/{id}/approve', [AdminTrainerController::class, 'approve']);
    Route::post('trainers/{id}/reject', [AdminTrainerController::class, 'reject']);
    Route::get('trainers/{id}/reviews', [AdminTrainerController::class, 'getReviews']);
    Route::get('trainers/{id}/complaints', [AdminTrainerController::class, 'getComplaints']);
    
    // Company Management
    Route::apiResource('companies', AdminCompanyController::class);
    Route::post('companies/{id}/verify', [AdminCompanyController::class, 'verify']);
    Route::post('companies/{id}/reject', [AdminCompanyController::class, 'reject']);
    Route::get('companies/{id}/campaigns', [AdminCompanyController::class, 'getCampaigns']);
    Route::get('companies/{id}/candidates', [AdminCompanyController::class, 'getCandidates']);
    
    // Booking Management
    Route::apiResource('bookings', AdminBookingController::class);
    Route::get('bookings/status/{status}', [AdminBookingController::class, 'getByStatus']);
    
    // Payment Management
    Route::apiResource('payments', AdminPaymentController::class);
    Route::get('payments/status/{status}', [AdminPaymentController::class, 'getByStatus']);
    Route::post('payments/{id}/refund', [AdminPaymentController::class, 'refund']);
    Route::apiResource('payouts', AdminPaymentController::class);
    Route::post('payouts/{id}/process', [AdminPaymentController::class, 'processPayouts']);
    Route::apiResource('invoices', AdminPaymentController::class);
    
    // Notification Management
    Route::post('notifications/send', [AdminNotificationController::class, 'send']);
    Route::post('notifications/broadcast', [AdminNotificationController::class, 'broadcast']);
    Route::post('notifications/email', [AdminNotificationController::class, 'sendEmail']);
    Route::get('notifications/history', [AdminNotificationController::class, 'history']);
    
    // Reports & Analytics
    Route::get('reports/users', [AdminReportController::class, 'userGrowth']);
    Route::get('reports/revenue', [AdminReportController::class, 'revenue']);
    Route::get('reports/bookings', [AdminReportController::class, 'bookings']);
    Route::get('reports/trainers', [AdminReportController::class, 'trainerPerformance']);
    Route::post('reports/export', [AdminReportController::class, 'export']);
    
    // Settings
    Route::get('settings', [AdminSettingsController::class, 'index']);
    Route::put('settings', [AdminSettingsController::class, 'update']);
    Route::put('settings/payment', [AdminSettingsController::class, 'updatePayment']);
    Route::put('settings/video', [AdminSettingsController::class, 'updateVideo']);
    Route::put('settings/communication', [AdminSettingsController::class, 'updateCommunication']);
});
