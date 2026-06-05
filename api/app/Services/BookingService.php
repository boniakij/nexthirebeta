<?php

namespace App\Services;

use App\Models\Interview;
use App\Models\Student;
use App\Models\Package;
use App\Models\TrainerAvailability;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class BookingService
{
    /**
     * Create a booking with slot locking
     */
    public function createBooking(Student $student, Package $package, TrainerAvailability $slot): Interview
    {
        return DB::transaction(function () use ($student, $package, $slot) {
            // Lock the slot to prevent double booking
            $lockedSlot = TrainerAvailability::where('id', $slot->id)
                ->lockForUpdate()
                ->first();

            // Verify slot is still available
            if ($lockedSlot->is_booked) {
                throw new \Exception('This slot is no longer available.');
            }

            // Create interview record
            $interview = Interview::create([
                'student_id' => $student->id,
                'trainer_id' => $package->trainer_id,
                'package_id' => $package->id,
                'availability_id' => $slot->id,
                'scheduled_at' => $slot->date . ' ' . $slot->start_time,
                'duration_minutes' => $package->duration_minutes,
                'status' => 'scheduled',
            ]);

            // Mark slot as booked
            $lockedSlot->update(['is_booked' => true]);

            // Increment package bookings count
            $package->increment('total_bookings');

            return $interview;
        });
    }

    /**
     * Cancel a booking with optional refund logic
     */
    public function cancelBooking(Interview $interview, $reason = null): bool
    {
        return DB::transaction(function () use ($interview, $reason) {
            // Update interview status
            $interview->update([
                'status' => 'cancelled',
                'cancelled_at' => now(),
                'cancelled_reason' => $reason,
            ]);

            // Mark availability slot as not booked
            if ($interview->availability_id) {
                TrainerAvailability::find($interview->availability_id)
                    ->update(['is_booked' => false]);
            }

            // Decrement package bookings count
            $interview->package->decrement('total_bookings');

            // Handle refund if within 24 hours
            $hoursElapsed = $interview->created_at->diffInHours(now());
            if ($hoursElapsed < 24) {
                $this->processRefund($interview);
            }

            return true;
        });
    }

    /**
     * Process refund for cancelled booking
     */
    private function processRefund(Interview $interview): void
    {
        $payment = $interview->payments()
            ->where('status', 'completed')
            ->first();

        if ($payment) {
            $payment->update([
                'status' => 'refunded',
            ]);
        }
    }
}
