<?php

namespace App\Services;

use App\Models\TrainerEarningLedger;
use App\Models\TrainerWallet;
use Carbon\Carbon;

class EarningService
{
    protected WalletService $walletService;

    public function __construct(WalletService $walletService)
    {
        $this->walletService = walletService;
    }

    /**
     * Create earning record after session completion
     */
    public function createEarning($trainerId, $studentId, $bookingId, $interviewId, $paymentId, $grossAmount, $commissionAmount)
    {
        $netAmount = $grossAmount - $commissionAmount;

        $earning = TrainerEarningLedger::create([
            'trainer_id' => $trainerId,
            'student_id' => $studentId,
            'booking_id' => $bookingId,
            'interview_id' => $interviewId,
            'payment_id' => $paymentId,
            'gross_amount' => $grossAmount,
            'commission_amount' => $commissionAmount,
            'net_amount' => $netAmount,
            'currency' => 'BDT',
            'status' => 'pending',
            'available_at' => Carbon::now()->addDays(7), // 7-day refund window
        ]);

        // Add to wallet pending balance
        $this->walletService->addPendingEarning($trainerId, $netAmount, $commissionAmount);

        return $earning;
    }

    /**
     * Release earnings after refund window
     */
    public function releaseEarnings($trainerId, $daysAgo = 7)
    {
        $earnings = TrainerEarningLedger::where('trainer_id', $trainerId)
            ->where('status', 'pending')
            ->where('available_at', '<=', Carbon::now())
            ->get();

        foreach ($earnings as $earning) {
            $earning->update(['status' => 'available']);
            $this->walletService->releaseEarning($trainerId, $earning->net_amount);
        }

        return count($earnings);
    }

    /**
     * Mark earning as withdrawn
     */
    public function markAsWithdrawn($trainerId, $withdrawalId)
    {
        TrainerEarningLedger::where('trainer_id', $trainerId)
            ->where('status', 'available')
            ->update(['status' => 'withdraw_requested']);

        return true;
    }

    /**
     * Mark earning as paid
     */
    public function markAsPaid($trainerId, $amount)
    {
        $earnings = TrainerEarningLedger::where('trainer_id', $trainerId)
            ->where('status', 'withdraw_requested')
            ->get();

        $paid = 0;
        foreach ($earnings as $earning) {
            if ($paid + $earning->net_amount <= $amount) {
                $earning->update(['status' => 'paid']);
                $paid += $earning->net_amount;
            }
        }

        return $paid;
    }

    /**
     * Cancel earning (refund)
     */
    public function cancelEarning($earningId)
    {
        $earning = TrainerEarningLedger::find($earningId);

        if ($earning && $earning->status === 'pending') {
            $earning->update(['status' => 'refunded']);
            return true;
        }

        return false;
    }
}
