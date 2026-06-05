<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerAvailability;
use App\Services\TrainerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AvailabilityController extends Controller
{
    protected TrainerService $trainerService;

    public function __construct(TrainerService $trainerService)
    {
        $this->trainerService = $trainerService;
    }

    /**
     * Set availability slots for trainer
     */
    public function setAvailability(Request $request): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $validated = $request->validate([
            'availability' => 'required|array',
            'availability.*.date' => 'required|date|after_or_equal:today',
            'availability.*.start_time' => 'required|date_format:H:i',
            'availability.*.end_time' => 'required|date_format:H:i|after:availability.*.start_time',
        ]);

        $createdSlots = [];
        foreach ($validated['availability'] as $slot) {
            try {
                $availability = TrainerAvailability::create([
                    'trainer_id' => $trainer->id,
                    'date' => $slot['date'],
                    'start_time' => $slot['start_time'],
                    'end_time' => $slot['end_time'],
                    'is_booked' => false,
                ]);

                $createdSlots[] = $availability;
            } catch (\Illuminate\Database\QueryException $e) {
                // Handle duplicate slot error
                if ($e->getCode() === 23000) {
                    continue; // Skip duplicate slots
                }
                throw $e;
            }
        }

        return response()->json([
            'success' => true,
            'data' => $createdSlots,
            'message' => count($createdSlots) . ' slot(s) created successfully',
        ], 201);
    }

    /**
     * Get availability slots for a trainer
     */
    public function getAvailability(int $trainerId, Request $request): JsonResponse
    {
        $date = $request->query('date');

        if (!$date) {
            return response()->json([
                'success' => false,
                'message' => 'Date parameter is required',
            ], 400);
        }

        $slots = $this->trainerService->getAvailableSlots($trainerId, $date);

        return response()->json([
            'success' => true,
            'data' => $slots,
        ]);
    }
}
