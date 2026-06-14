<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerBookingRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerBookingRuleController extends Controller
{
    public function show(Request $request): JsonResponse
    {
        try {
            $trainer = $request->user()->trainer();
            $rules = $trainer->bookingRules;

            if (!$rules) {
                $rules = TrainerBookingRule::create([
                    'trainer_id' => $trainer->id,
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $rules,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch rules: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'minimum_notice_hours' => 'integer|min:0|max:168',
                'max_booking_days_ahead' => 'integer|min:1|max:365',
                'allow_same_day_booking' => 'boolean',
                'allow_reschedule' => 'boolean',
                'max_reschedule_count' => 'integer|min:0',
                'reschedule_deadline_hours' => 'integer|min:0|max:168',
                'allow_cancellation' => 'boolean',
                'cancellation_deadline_hours' => 'integer|min:0|max:168',
                'auto_confirm_paid_bookings' => 'boolean',
                'timezone' => 'string|max:50',
            ]);

            $trainer = $request->user()->trainer();
            $rules = $trainer->bookingRules;

            if (!$rules) {
                $rules = TrainerBookingRule::create([
                    'trainer_id' => $trainer->id,
                    ...$validated,
                ]);
            } else {
                $rules->update($validated);
            }

            return response()->json([
                'success' => true,
                'message' => 'Booking rules updated',
                'data' => $rules,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update rules: ' . $e->getMessage(),
            ], 500);
        }
    }
}
