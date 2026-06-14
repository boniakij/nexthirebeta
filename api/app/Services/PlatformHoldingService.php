<?php

namespace App\Services;

use App\Models\PlatformHoldingLedger;

class PlatformHoldingService
{
    /**
     * Create platform holding ledger entry
     */
    public function hold($paymentId, $bookingId, $interviewId, $trainerId, $studentId, $grossAmount)
    {
        return PlatformHoldingLedger::create([
            'payment_id' => $paymentId,
            'booking_id' => $bookingId,
            'interview_id' => $interviewId,
            'trainer_id' => $trainerId,
            'student_id' => $studentId,
            'gross_amount' => $grossAmount,
            'currency' => 'BDT',
            'status' => 'platform_held',
            'held_at' => now(),
        ]);
    }

    /**
     * Release held funds to trainer
     */
    public function releaseToTrainer($paymentId)
    {
        $holding = PlatformHoldingLedger::where('payment_id', $paymentId)->first();

        if ($holding) {
            $holding->update([
                'status' => 'released_to_trainer',
                'released_at' => now(),
            ]);
        }

        return $holding;
    }

    /**
     * Refund held funds
     */
    public function refund($paymentId)
    {
        $holding = PlatformHoldingLedger::where('payment_id', $paymentId)->first();

        if ($holding) {
            $holding->update([
                'status' => 'refunded',
                'released_at' => now(),
            ]);
        }

        return $holding;
    }

    /**
     * Get holding record by payment
     */
    public function getByPayment($paymentId)
    {
        return PlatformHoldingLedger::where('payment_id', $paymentId)->first();
    }
}
