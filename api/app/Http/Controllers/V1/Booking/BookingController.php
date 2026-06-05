<?php

namespace App\Http\Controllers\V1\Booking;

use App\Http\Controllers\Controller;
use App\Models\Interview;
use App\Models\Package;
use App\Models\TrainerAvailability;
use App\Services\BookingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    protected BookingService $bookingService;

    public function __construct(BookingService $bookingService)
    {
        $this->bookingService = $bookingService;
    }

    /**
     * Create a booking
     */
    public function store(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $validated = $request->validate([
            'package_id' => 'required|exists:packages,id',
            'availability_id' => 'required|exists:trainer_availability,id',
        ]);

        try {
            $package = Package::findOrFail($validated['package_id']);
            $availability = TrainerAvailability::findOrFail($validated['availability_id']);

            // Verify availability belongs to package's trainer
            if ($availability->trainer_id !== $package->trainer_id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Availability slot does not match the package trainer',
                ], 400);
            }

            $interview = $this->bookingService->createBooking(
                $student,
                $package,
                $availability
            );

            return response()->json([
                'success' => true,
                'data' => [
                    'interview_id' => $interview->id,
                    'scheduled_at' => $interview->scheduled_at,
                    'duration_minutes' => $interview->duration_minutes,
                    'status' => $interview->status,
                ],
                'message' => 'Booking created successfully. Proceed to payment.',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get booking details
     */
    public function show(int $id): JsonResponse
    {
        $interview = Interview::with('student', 'trainer', 'package')
            ->findOrFail($id);

        // Verify user is student or trainer in this interview
        $user = auth()->user();
        if ($interview->student->user_id !== $user->id && $interview->trainer->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized',
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $interview->id,
                'student' => [
                    'id' => $interview->student->id,
                    'name' => $interview->student->full_name,
                    'email' => $interview->student->user->email,
                ],
                'trainer' => [
                    'id' => $interview->trainer->id,
                    'name' => $interview->trainer->full_name,
                    'email' => $interview->trainer->user->email,
                ],
                'package' => [
                    'id' => $interview->package->id,
                    'title' => $interview->package->title,
                    'price' => $interview->package->price,
                ],
                'scheduled_at' => $interview->scheduled_at,
                'duration_minutes' => $interview->duration_minutes,
                'status' => $interview->status,
                'meeting_link' => $interview->meeting_link,
            ],
        ]);
    }

    /**
     * Cancel booking
     */
    public function cancel(int $id, Request $request): JsonResponse
    {
        $interview = Interview::findOrFail($id);
        $student = auth()->user()->student;

        // Verify user is the student who booked this
        if (!$student || $interview->student_id !== $student->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to cancel this booking',
            ], 403);
        }

        try {
            $reason = $request->input('reason', 'User requested cancellation');

            $this->bookingService->cancelBooking($interview, $reason);

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully. Refund will be processed if applicable.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
