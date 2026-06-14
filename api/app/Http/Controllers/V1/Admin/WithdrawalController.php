<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\TrainerWithdrawal;
use App\Services\AdminWithdrawalService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WithdrawalController extends Controller
{
    protected AdminWithdrawalService $withdrawalService;

    public function __construct(AdminWithdrawalService $withdrawalService)
    {
        $this->withdrawalService = $withdrawalService;
    }

    /**
     * Get all withdrawals
     */
    public function index(): JsonResponse
    {
        $withdrawals = TrainerWithdrawal::with('trainer')
            ->orderBy('requested_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $withdrawals,
        ]);
    }

    /**
     * Get pending withdrawals
     */
    public function pending(): JsonResponse
    {
        $withdrawals = $this->withdrawalService->getPending();

        return response()->json([
            'success' => true,
            'data' => $withdrawals->map(fn($w) => [
                'withdrawal_id' => $w->id,
                'trainer_id' => $w->trainer_id,
                'trainer_name' => $w->trainer->user->name ?? 'N/A',
                'amount' => (float)$w->amount,
                'currency' => $w->currency,
                'method' => 'bank_transfer', // TODO: get from payout method
                'account_number' => '***', // TODO: mask sensitive data
                'status' => $w->status,
                'requested_at' => $w->requested_at,
            ]),
        ]);
    }

    /**
     * Get single withdrawal
     */
    public function show(TrainerWithdrawal $withdrawal): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $withdrawal,
        ]);
    }

    /**
     * Approve withdrawal
     */
    public function approve(Request $request, TrainerWithdrawal $withdrawal): JsonResponse
    {
        $validated = $request->validate([
            'admin_note' => 'nullable|string|max:500',
        ]);

        try {
            $withdrawal = $this->withdrawalService->approve(
                $withdrawal->id,
                $validated['admin_note'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal approved.',
                'data' => $withdrawal,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Reject withdrawal
     */
    public function reject(Request $request, TrainerWithdrawal $withdrawal): JsonResponse
    {
        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
            'admin_note' => 'nullable|string|max:500',
        ]);

        try {
            $withdrawal = $this->withdrawalService->reject(
                $withdrawal->id,
                $validated['rejection_reason'],
                $validated['admin_note'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal rejected.',
                'data' => $withdrawal,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Mark withdrawal as paid
     */
    public function markPaid(Request $request, TrainerWithdrawal $withdrawal): JsonResponse
    {
        $validated = $request->validate([
            'transaction_reference' => 'required|string|max:100',
            'paid_at' => 'nullable|date',
            'admin_note' => 'nullable|string|max:500',
        ]);

        try {
            $withdrawal = $this->withdrawalService->markPaid(
                $withdrawal->id,
                $validated['transaction_reference'],
                isset($validated['paid_at']) ? now()->parse($validated['paid_at']) : null,
                $validated['admin_note'] ?? null
            );

            return response()->json([
                'success' => true,
                'message' => 'Withdrawal marked as paid.',
                'data' => [
                    'withdrawal_id' => $withdrawal->id,
                    'status' => $withdrawal->status,
                    'transaction_reference' => $withdrawal->transaction_reference,
                    'paid_at' => $withdrawal->paid_at,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }
}
