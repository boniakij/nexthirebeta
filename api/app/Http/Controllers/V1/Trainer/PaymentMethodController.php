<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * Get trainer's payout methods
     */
    public function index(): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $methods = [
            [
                'id' => 1,
                'method' => 'bank_transfer',
                'bank_name' => 'Dhaka Bank',
                'account_number' => '****1234',
                'holder_name' => 'Verified',
                'status' => 'verified',
                'is_default' => true,
            ],
        ];

        return response()->json([
            'success' => true,
            'data' => $methods,
        ]);
    }

    /**
     * Add payout method
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'method' => 'required|in:bank_transfer,bkash,nagad',
            'bank_name' => 'required_if:method,bank_transfer|string|max:100',
            'account_number' => 'required|string|max:50',
            'holder_name' => 'required|string|max:100',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payout method added successfully.',
            'data' => [
                'id' => 1,
                ...$validated,
                'status' => 'pending_verification',
            ],
        ], 201);
    }

    /**
     * Update payout method
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'holder_name' => 'string|max:100',
            'is_default' => 'boolean',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payout method updated.',
            'data' => ['id' => $id, ...$validated],
        ]);
    }

    /**
     * Delete payout method
     */
    public function destroy(int $id): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => 'Payout method deleted.',
        ]);
    }
}
