<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerWallet;
use Illuminate\Http\JsonResponse;

class WalletController extends Controller
{
    /**
     * Get trainer wallet information
     */
    public function show(): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $wallet = TrainerWallet::firstOrCreate(
            ['trainer_id' => $trainer->id],
            [
                'currency' => 'BDT',
                'total_earned' => 0,
                'available_balance' => 0,
                'pending_balance' => 0,
                'withdrawn_amount' => 0,
                'platform_commission_total' => 0,
            ]
        );

        return response()->json([
            'success' => true,
            'data' => [
                'currency' => $wallet->currency,
                'total_earned' => (float)$wallet->total_earned,
                'available_balance' => (float)$wallet->available_balance,
                'pending_balance' => (float)$wallet->pending_balance,
                'withdrawn_amount' => (float)$wallet->withdrawn_amount,
                'platform_commission_total' => (float)$wallet->platform_commission_total,
                'minimum_withdraw_amount' => 1000,
                'withdrawal_allowed' => (float)$wallet->available_balance >= 1000,
            ],
        ]);
    }
}
