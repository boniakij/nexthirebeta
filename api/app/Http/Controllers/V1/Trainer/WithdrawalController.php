<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerWithdrawal;
use App\Models\TrainerWallet;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    /**
     * Get trainer's withdrawal history
     */
    public function index(): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $withdrawals = TrainerWithdrawal::where('trainer_id', $trainer->id)
            ->orderBy('requested_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $withdrawals,
        ]);
    }

    /**
     * Request withdrawal
     */
    public function store(Request $request): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:1000',
            'payout_method_id' => 'required|exists:payout_methods,id',
            'note' => 'nullable|string|max:500',
        ]);

        $wallet = TrainerWallet::where('trainer_id', $trainer->id)->first();

        if (!$wallet || (float)$wallet->available_balance < $validated['amount']) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient available balance',
            ], 400);
        }

        // Create withdrawal request
        $withdrawal = TrainerWithdrawal::create([
            'trainer_id' => $trainer->id,
            'payout_method_id' => $validated['payout_method_id'],
            'amount' => $validated['amount'],
            'currency' => 'BDT',
            'status' => 'pending',
            'trainer_note' => $validated['note'] ?? null,
        ]);

        // Deduct from available balance
        $wallet->update([
            'available_balance' => $wallet->available_balance - $validated['amount'],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Withdrawal request submitted successfully.',
            'data' => [
                'withdrawal_id' => $withdrawal->id,
                'amount' => (float)$withdrawal->amount,
                'currency' => $withdrawal->currency,
                'status' => $withdrawal->status,
            ],
        ]);
    }
}
