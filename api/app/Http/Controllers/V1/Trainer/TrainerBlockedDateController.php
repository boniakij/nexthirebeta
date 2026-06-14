<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerBlockedDate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerBlockedDateController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $blockedDates = $request->user()->trainer()->blockedDates()->get();

            return response()->json([
                'success' => true,
                'data' => $blockedDates,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch blocked dates: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'block_type' => 'required|in:personal_leave,public_holiday,emergency,vacation',
                'date' => 'required|date|after_or_equal:today',
                'start_time' => 'date_format:H:i|nullable',
                'end_time' => 'date_format:H:i|nullable|after:start_time',
                'is_full_day' => 'boolean|nullable',
                'reason' => 'string|max:255|nullable',
                'cancel_existing_bookings' => 'boolean|nullable',
            ]);

            $trainer = $request->user()->trainer();

            $blockedDate = $trainer->blockedDates()->create(array_merge(
                $validated,
                [
                    'is_full_day' => $validated['is_full_day'] ?? true,
                    'cancel_existing_bookings' => $validated['cancel_existing_bookings'] ?? false,
                ]
            ));

            return response()->json([
                'success' => true,
                'message' => 'Date blocked successfully',
                'data' => $blockedDate,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to block date: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, $blockedDateId): JsonResponse
    {
        try {
            $blockedDate = TrainerBlockedDate::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($blockedDateId);

            $blockedDate->delete();

            return response()->json([
                'success' => true,
                'message' => 'Blocked date removed',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to remove blocked date: ' . $e->getMessage(),
            ], 500);
        }
    }
}
