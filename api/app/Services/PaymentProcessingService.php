<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Interview;
use App\Models\InterviewBooking;

class PaymentProcessingService
{
    protected CommissionService $commissionService;
    protected PlatformHoldingService $platformHoldingService;
    protected EarningService $earningService;

    public function __construct(
        CommissionService $commissionService,
        PlatformHoldingService $platformHoldingService,
        EarningService $earningService
    ) {
        $this->commissionService = $commissionService;
        $this->platformHoldingService = $platformHoldingService;
        $this->earningService = $earningService;
    }

    /**
     * Process payment success callback
     */
    public function processPaymentSuccess($paymentId, $gatewayTxnId)
    {
        $payment = Payment::findOrFail($paymentId);

        if ($payment->status !== 'pending') {
            throw new \Exception('Payment already processed');
        }

        // Update payment status
        $payment->update([
            'status' => 'completed',
            'gateway_txn_id' => $gatewayTxnId,
        ]);

        // Get booking and interview
        $interview = Interview::findOrFail($payment->interview_id);
        $booking = InterviewBooking::findOrFail($interview->booking_id);

        // Update booking and interview status
        $booking->update(['status' => 'confirmed']);
        $interview->update(['status' => 'scheduled']);

        // Create platform holding ledger
        $this->platformHoldingService->hold(
            $payment->id,
            $booking->id,
            $interview->id,
            $booking->trainer_id,
            $booking->student_id,
            $payment->amount
        );

        return $payment;
    }

    /**
     * Process session completion and commission calculation
     */
    public function processSessionCompletion($interviewId)
    {
        $interview = Interview::findOrFail($interviewId);
        $booking = InterviewBooking::findOrFail($interview->booking_id);
        $payment = Payment::where('interview_id', $interviewId)->first();

        if (!$payment) {
            throw new \Exception('Payment not found for interview');
        }

        // Calculate commission
        $commissionData = $this->commissionService->calculate(
            $payment->amount,
            $booking->trainer_id,
            $booking->package_id
        );

        // Record commission breakdown
        $this->commissionService->recordBreakdown(
            $payment,
            $booking->trainer_id,
            $booking->package_id,
            $commissionData
        );

        // Update payment with commission
        $payment->update([
            'commission' => $commissionData['commission_amount'],
        ]);

        // Create earning ledger
        $this->earningService->createEarning(
            $booking->trainer_id,
            $booking->student_id,
            $booking->id,
            $interview->id,
            $payment->id,
            $payment->amount,
            $commissionData['commission_amount']
        );

        // Mark interview as completed
        $interview->update(['status' => 'completed']);
        $booking->update(['status' => 'completed']);

        return [
            'interview_id' => $interview->id,
            'payment_id' => $payment->id,
            'commission' => $commissionData,
        ];
    }

    /**
     * Process refund
     */
    public function processRefund($paymentId, $reason = null)
    {
        $payment = Payment::findOrFail($paymentId);
        $interview = Interview::findOrFail($payment->interview_id);

        // Update payment status
        $payment->update(['status' => 'refunded']);

        // Refund platform holding
        $this->platformHoldingService->refund($payment->id);

        // Cancel earning
        $earning = $this->earningService->cancelEarning($interview->earning_id ?? null);

        // Update interview status
        $interview->update(['status' => 'cancelled']);

        return $payment;
    }
}
