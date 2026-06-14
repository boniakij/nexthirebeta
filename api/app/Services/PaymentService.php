<?php

namespace App\Services;

use App\Models\Interview;
use App\Models\Payment;
use App\Models\Student;
use App\Models\Package;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class PaymentService
{
    const COMMISSION_PERCENTAGE = 0.20; // 20% commission

    /**
     * Initiate payment for an interview
     */
    public function initiate(Student $student, Package $package, string $gateway, int $slotId): array
    {
        $interview = Interview::where('availability_id', $slotId)
            ->where('student_id', $student->id)
            ->where('package_id', $package->id)
            ->first();

        if (!$interview) {
            throw new \Exception('Interview not found for this booking.');
        }

        return DB::transaction(function () use ($student, $package, $gateway, $interview) {
            $amount = $package->price;
            $commission = $amount * self::COMMISSION_PERCENTAGE;

            // Create payment record
            $payment = Payment::create([
                'payer_id' => $student->user_id,
                'payee_id' => $package->trainer->user_id,
                'interview_id' => $interview->id,
                'amount' => $amount,
                'commission' => $commission,
                'currency' => 'BDT',
                'gateway' => $gateway,
                'status' => 'pending',
            ]);

            // Call gateway SDK to get payment URL
            $paymentUrl = $this->getPaymentUrl($gateway, $payment);

            return [
                'payment_id' => $payment->id,
                'payment_url' => $paymentUrl,
                'amount' => $amount,
                'currency' => 'BDT',
                'gateway' => $gateway,
            ];
        });
    }

    /**
     * Get payment URL from gateway
     */
    private function getPaymentUrl(string $gateway, Payment $payment): string
    {
        // This is a placeholder implementation
        // In production, integrate with actual payment gateways
        switch ($gateway) {
            case 'sslcommerz':
                return $this->getSslcommerzPaymentUrl($payment);
            case 'bkash':
                return $this->getBkashPaymentUrl($payment);
            default:
                throw new \Exception("Unsupported gateway: $gateway");
        }
    }

    /**
     * Get SSLCommerz payment URL
     */
    private function getSslcommerzPaymentUrl(Payment $payment): string
    {
        return config('services.sslcommerz.base_url', 'http://localhost:3000') . '/payment/simulate?payment_id=' . $payment->id . '&gateway=sslcommerz&amount=' . $payment->amount;
    }

    /**
     * Get bKash payment URL
     */
    private function getBkashPaymentUrl(Payment $payment): string
    {
        return config('services.bkash.base_url', 'http://localhost:3000') . '/payment/simulate?payment_id=' . $payment->id . '&gateway=bkash&amount=' . $payment->amount;
    }

    /**
     * Handle payment callback
     */
    public function handleCallback(string $gateway, array $payload): array
    {
        if ($gateway === 'sslcommerz') {
            return $this->handleSslcommerzCallback($payload);
        } elseif ($gateway === 'bkash') {
            return $this->handleBkashCallback($payload);
        }

        throw new \Exception("Unsupported gateway: $gateway");
    }

    /**
     * Handle SSLCommerz callback
     */
    private function handleSslcommerzCallback(array $payload): array
    {
        // Verify webhook signature
        if (!$this->verifySSLCommerz($payload)) {
            throw new \Exception('Invalid SSLCommerz signature');
        }

        $paymentId = $payload['payment_id'] ?? null;
        $status = $payload['status'] ?? null;

        return $this->updatePaymentStatus($paymentId, $status === 'VALID' ? 'completed' : 'failed');
    }

    /**
     * Handle bKash callback
     */
    private function handleBkashCallback(array $payload): array
    {
        // Verify webhook signature
        if (!$this->verifyBKash($payload)) {
            throw new \Exception('Invalid bKash signature');
        }

        $paymentId = $payload['payment_id'] ?? null;
        $status = $payload['status'] ?? null;

        return $this->updatePaymentStatus($paymentId, $status === 'Completed' ? 'completed' : 'failed');
    }

    /**
     * Update payment status and related records
     */
    private function updatePaymentStatus(int $paymentId, string $status): array
    {
        return DB::transaction(function () use ($paymentId, $status) {
            $payment = Payment::findOrFail($paymentId);

            $payment->update([
                'status' => $status,
                'gateway_txn_id' => Str::uuid(),
            ]);

            if ($status === 'completed') {
                // Update interview status
                $interview = $payment->interview;
                $interview->update(['status' => 'scheduled']);

                // Generate meeting link
                $videoService = app(VideoService::class);
                $channel = $videoService->createChannel($interview);

                // Dispatch jobs for invoice and notifications
                \App\Jobs\GenerateInvoice::dispatch($payment);
                \App\Jobs\SendNotification::dispatch(
                    $interview->student->user_id,
                    'Payment Successful',
                    'Your interview booking is confirmed!'
                );
            }

            return [
                'payment_id' => $payment->id,
                'status' => $payment->status,
            ];
        });
    }

    /**
     * Verify SSLCommerz webhook signature
     */
    public function verifySSLCommerz(array $payload): bool
    {
        // Implement MD5 hash validation
        $hashString = implode(',', [
            $payload['store_id'] ?? '',
            $payload['status'] ?? '',
            $payload['amount'] ?? '',
            config('services.sslcommerz.store_password'),
        ]);

        $expectedHash = md5($hashString);
        return $expectedHash === ($payload['verification_key'] ?? '');
    }

    /**
     * Verify bKash webhook signature
     */
    public function verifyBKash(array $payload): bool
    {
        // Implement Bearer token validation
        $bearerToken = request()->bearerToken();
        return $bearerToken === config('services.bkash.webhook_token');
    }
}
