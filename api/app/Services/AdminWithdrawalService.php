<?php

namespace App\Services;

use App\Models\TrainerWithdrawal;
use App\Models\TrainerWallet;

class AdminWithdrawalService
{
    protected WalletService $walletService;
    protected EarningService $earningService;

    public function __construct(WalletService $walletService, EarningService $earningService)
    {
        $this->walletService = $walletService;
        $this->earningService = $earningService;
    }

    /**
     * Approve withdrawal request
     */
    public function approve($withdrawalId, $adminNote = null)
    {
        $withdrawal = TrainerWithdrawal::findOrFail($withdrawalId);

        if ($withdrawal->status !== 'pending') {
            throw new \Exception('Can only approve pending withdrawals');
        }

        $withdrawal->update([
            'status' => 'approved',
            'approved_at' => now(),
            'admin_note' => $adminNote,
        ]);

        return $withdrawal;
    }

    /**
     * Reject withdrawal request
     */
    public function reject($withdrawalId, $reason, $adminNote = null)
    {
        $withdrawal = TrainerWithdrawal::findOrFail($withdrawalId);

        if ($withdrawal->status !== 'pending') {
            throw new \Exception('Can only reject pending withdrawals');
        }

        $withdrawal->update([
            'status' => 'rejected',
            'rejected_at' => now(),
            'rejection_reason' => $reason,
            'admin_note' => $adminNote,
        ]);

        // Refund locked amount
        $this->walletService->refundWithdrawal($withdrawal->trainer_id, $withdrawal->amount);

        return $withdrawal;
    }

    /**
     * Mark withdrawal as paid
     */
    public function markPaid($withdrawalId, $transactionReference, $paidAt = null, $adminNote = null)
    {
        $withdrawal = TrainerWithdrawal::findOrFail($withdrawalId);

        if ($withdrawal->status !== 'approved' && $withdrawal->status !== 'processing') {
            throw new \Exception('Withdrawal must be approved before marking as paid');
        }

        if (!$transactionReference) {
            throw new \Exception('Transaction reference required');
        }

        $withdrawal->update([
            'status' => 'paid',
            'paid_at' => $paidAt ?? now(),
            'transaction_reference' => $transactionReference,
            'admin_note' => $adminNote,
        ]);

        // Update wallet
        $this->walletService->markWithdrawalPaid($withdrawal->trainer_id, $withdrawal->amount);

        // Mark earnings as paid
        $this->earningService->markAsPaid($withdrawal->trainer_id, $withdrawal->amount);

        return $withdrawal;
    }

    /**
     * Get pending withdrawals
     */
    public function getPending()
    {
        return TrainerWithdrawal::where('status', 'pending')
            ->with('trainer')
            ->orderBy('requested_at', 'asc')
            ->get();
    }
}
