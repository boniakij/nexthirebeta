<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Services\SettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    protected SettingsService $settingsService;

    public function __construct(SettingsService $settingsService)
    {
        $this->settingsService = $settingsService;
    }

    /**
     * GET /api/admin/settings
     */
    public function index(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $this->settingsService->getSettings(),
            'message' => 'Settings retrieved successfully',
        ]);
    }

    /**
     * PUT /api/admin/settings
     */
    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment' => 'sometimes|array',
            'video' => 'sometimes|array',
            'communication' => 'sometimes|array',
        ]);

        $updated = $this->settingsService->update($validated);

        return response()->json([
            'success' => true,
            'data' => $updated,
            'message' => 'Settings updated successfully',
        ]);
    }

    /**
     * PUT /api/admin/settings/payment
     */
    public function updatePayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sslcommerz' => 'sometimes|array',
            'bkash' => 'sometimes|array',
            'nagad' => 'sometimes|array',
            'stripe' => 'sometimes|array',
            'paypal' => 'sometimes|array',
            'bank' => 'sometimes|array',
        ]);

        $updated = $this->settingsService->update(['payment' => $validated]);

        return response()->json([
            'success' => true,
            'data' => $updated['payment'],
            'message' => 'Payment gateway settings updated successfully',
        ]);
    }

    /**
     * PUT /api/admin/settings/video
     */
    public function updateVideo(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'provider' => 'required|string',
            'app_id' => 'nullable|string',
            'app_certificate' => 'nullable|string',
        ]);

        $updated = $this->settingsService->update(['video' => $validated]);

        return response()->json([
            'success' => true,
            'data' => $updated['video'],
            'message' => 'Video settings updated successfully',
        ]);
    }

    /**
     * PUT /api/admin/settings/communication
     */
    public function updateCommunication(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_notifications' => 'required|boolean',
            'sms_notifications' => 'required|boolean',
            'push_notifications' => 'required|boolean',
        ]);

        $updated = $this->settingsService->update(['communication' => $validated]);

        return response()->json([
            'success' => true,
            'data' => $updated['communication'],
            'message' => 'Communication settings updated successfully',
        ]);
    }
}