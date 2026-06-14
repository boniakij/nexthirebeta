<?php

namespace App\Services;

use App\Models\TrainerWallet;

class WalletService
{
    /**
     * Get or create trainer wallet
     */
    public function getOrCreate($trainerId)
    {
        return TrainerWallet::firstOrCreate(
            ['trainer_id' => $trainerId],
            [
                'currency' => 'BDT',
                'total_earned' => 0,
                'available_balance' => 0,
                'pending_balance' => 0,
                'withdrawn_amount' => 0,
                'platform_commission_total' => 0,
            ]
        );
    }

    /**
     * Add pending earnings to wallet
     */
    public function addPendingEarning($trainerId, $netAmount, $commissionAmount)
    {
        $wallet = $this->getOrCreate($trainerId);

        $wallet->update([
            'total_earned' => $wallet->total_earned + $netAmount,
            'pending_balance' => $wallet->pending_balance + $netAmount,
            'platform_commission_total' => $wallet->platform_commission_total + $commissionAmount,
        ]);

        return $wallet;
    }

    /**
     * Release pending earnings to available balance
     */
    public function releaseEarning($trainerId, $netAmount)
    {
        $wallet = TrainerWallet::where('trainer_id', $trainerId)->first();

        if ($wallet) {
            $wallet->update([
                'pending_balance' => max(0, $wallet->pending_balance - $netAmount),
                'available_balance' => $wallet->available_balance + $netAmount,
            ]);
        }

        return $wallet;
    }

    /**
     * Lock amount for withdrawal
     */
    public function lockForWithdrawal($trainerId, $amount)
    {
        $wallet = TrainerWallet::where('trainer_id', $trainerId)->first();

        if (!$wallet || $wallet->available_balance < $amount) {
            throw new \Exception('Insufficient available balance');
        }

        $wallet->update([
            'available_balance' => $wallet->available_balance - $amount,
        ]);

        return $wallet;
    }

    /**
     * Refund locked amount
     */
    public function refundWithdrawal($trainerId, $amount)
    {
        $wallet = TrainerWallet::where('trainer_id', $trainerId)->first();

        if ($wallet) {
            $wallet->update([
                'available_balance' => $wallet->available_balance + $amount,
            ]);
        }

        return $wallet;
    }

    /**
     * Mark withdrawal as paid
     */
    public function markWithdrawalPaid($trainerId, $amount)
    {
        $wallet = TrainerWallet::where('trainer_id', $trainerId)->first();

        if ($wallet) {
            $wallet->update([
                'withdrawn_amount' => $wallet->withdrawn_amount + $amount,
            ]);
        }

        return $wallet;
    }
}
