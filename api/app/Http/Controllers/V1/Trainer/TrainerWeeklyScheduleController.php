<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerWeeklySchedule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerWeeklyScheduleController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $schedules = $request->user()->trainer()->weeklySchedules()->get();

            return response()->json([
                'success' => true,
                'data' => $schedules,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch schedule: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'schedule' => 'required|array',
                'schedule.*.day_of_week' => 'required|integer|min:0|max:6',
                'schedule.*.is_available' => 'required|boolean',
                'schedule.*.start_time' => 'required_if:schedule.*.is_available,true|date_format:H:i',
                'schedule.*.end_time' => 'required_if:schedule.*.is_available,true|date_format:H:i',
                'schedule.*.slot_duration_minutes' => 'required_if:schedule.*.is_available,true|integer|min:15',
                'schedule.*.buffer_minutes' => 'required_if:schedule.*.is_available,true|integer|min:0',
            ]);

            $trainer = $request->user()->trainer();

            foreach ($validated['schedule'] as $day) {
                TrainerWeeklySchedule::updateOrCreate(
                    [
                        'trainer_id' => $trainer->id,
                        'day_of_week' => $day['day_of_week'],
                    ],
                    [
                        'is_available' => $day['is_available'],
                        'start_time' => $day['is_available'] ? $day['start_time'] : null,
                        'end_time' => $day['is_available'] ? $day['end_time'] : null,
                        'slot_duration_minutes' => $day['slot_duration_minutes'] ?? 60,
                        'buffer_minutes' => $day['buffer_minutes'] ?? 15,
                        'status' => 'active',
                    ]
                );
            }

            return response()->json([
                'success' => true,
                'message' => 'Weekly schedule updated',
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
                'message' => 'Failed to update schedule: ' . $e->getMessage(),
            ], 500);
        }
    }
}
