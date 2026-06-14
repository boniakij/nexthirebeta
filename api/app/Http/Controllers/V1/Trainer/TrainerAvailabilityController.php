<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerAvailabilitySlot;
use App\Models\TrainerWeeklySchedule;
use App\Models\TrainerBlockedDate;
use App\Models\TrainerBookingRule;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerAvailabilityController extends Controller
{
    // Get availability calendar for a date range
    public function calendar(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'required|date',
                'end_date' => 'required|date|after:start_date',
            ]);

            $trainer = $request->user()->trainer();
            $slots = $trainer->availabilitySlots()
                ->whereBetween('date', [$validated['start_date'], $validated['end_date']])
                ->get()
                ->groupBy('date');

            return response()->json([
                'success' => true,
                'data' => $slots,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch calendar: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Add availability slot
    public function addSlot(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'date' => 'required|date|after_or_equal:today',
                'start_time' => 'required|date_format:H:i',
                'end_time' => 'required|date_format:H:i|after:start_time',
                'slot_duration_minutes' => 'required|integer|min:15|max:480',
            ]);

            $trainer = $request->user()->trainer();

            // Check for overlapping slots
            $existing = $trainer->availabilitySlots()
                ->where('date', $validated['date'])
                ->whereBetween('start_time', [$validated['start_time'], $validated['end_time']])
                ->exists();

            if ($existing) {
                return response()->json([
                    'success' => false,
                    'message' => 'Overlapping availability slot exists',
                ], 422);
            }

            // Create slot
            $slot = $trainer->availabilitySlots()->create([
                'date' => $validated['date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'slot_duration_minutes' => $validated['slot_duration_minutes'],
                'status' => 'available',
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Availability slot created',
                'data' => $slot,
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
                'message' => 'Failed to add slot: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Delete availability slot
    public function deleteSlot(Request $request, $slotId): JsonResponse
    {
        try {
            $slot = TrainerAvailabilitySlot::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($slotId);

            if ($slot->status === 'booked') {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete booked slot',
                ], 422);
            }

            $slot->delete();

            return response()->json([
                'success' => true,
                'message' => 'Slot deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete slot: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get available slots for student booking
    public function getAvailableSlots($trainerId, Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'date' => 'date|after_or_equal:today',
                'days_ahead' => 'integer|min:1|max:90',
            ]);

            $trainer = \App\Models\Trainer::findOrFail($trainerId);
            $bookingRules = $trainer->bookingRules ?? new TrainerBookingRule();

            $query = $trainer->availabilitySlots()
                ->where('status', 'available');

            if (isset($validated['date'])) {
                $query->where('date', $validated['date']);
            } else {
                $daysAhead = $validated['days_ahead'] ?? $bookingRules->max_booking_days_ahead ?? 30;
                $query->whereBetween('date', [Carbon::today(), Carbon::today()->addDays($daysAhead)]);
            }

            $slots = $query->get();

            return response()->json([
                'success' => true,
                'data' => $slots,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch available slots: ' . $e->getMessage(),
            ], 500);
        }
    }
}
