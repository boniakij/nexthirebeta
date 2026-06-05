<?php

namespace App\Http\Controllers\V1\Payment;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Package;
use App\Models\Payment;
use App\Models\TrainerAvailability;
use App\Services\PaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected PaymentService $paymentService;

    public function __construct(PaymentService $paymentService)
    {
        $this->paymentService = $paymentService;
    }

    /**
     * Initiate payment for an interview
     */
    public function initiate(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $validated = $request->validate([
            'interview_id' => 'required|exists:interviews,id',
            'gateway' => 'required|in:sslcommerz,bkash,nagad,stripe,paypal',
        ]);

        try {
            $interview = $student->interviews()
                ->findOrFail($validated['interview_id']);

            $package = $interview->package;

            $paymentDetails = $this->paymentService->initiate(
                $student,
                $package,
                $validated['gateway'],
                $interview->availability_id
            );

            return response()->json([
                'success' => true,
                'data' => $paymentDetails,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Handle SSLCommerz webhook callback (public endpoint)
     */
    public function sslcommerzCallback(Request $request): JsonResponse
    {
        try {
            $result = $this->paymentService->handleCallback('sslcommerz', $request->all());

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Handle bKash webhook callback (public endpoint)
     */
    public function bkashCallback(Request $request): JsonResponse
    {
        try {
            $result = $this->paymentService->handleCallback('bkash', $request->all());

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get payment history for authenticated user
     */
    public function history(Request $request): JsonResponse
    {
        $user = auth()->user();
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 15);

        $payments = Payment::where('payer_id', $user->id)
            ->with('interview')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'success' => true,
            'data' => $payments->items(),
            'meta' => [
                'current_page' => $payments->currentPage(),
                'total' => $payments->total(),
                'per_page' => $payments->perPage(),
                'last_page' => $payments->lastPage(),
            ],
        ]);
    }

    /**
     * Get payment invoice
     */
    public function invoice(int $id): JsonResponse
    {
        $payment = Payment::findOrFail($id);
        $user = auth()->user();

        // Verify user is the payer
        if ($payment->payer_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized to access this invoice',
            ], 403);
        }

        $invoice = Invoice::where('payment_id', $payment->id)->first();

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $invoice->id,
                'invoice_number' => $invoice->invoice_number,
                'amount' => $payment->amount,
                'commission' => $payment->commission,
                'gateway' => $payment->gateway,
                'status' => $payment->status,
                'pdf_path' => $invoice->pdf_path,
                'created_at' => $invoice->created_at,
            ],
        ]);
    }
}
