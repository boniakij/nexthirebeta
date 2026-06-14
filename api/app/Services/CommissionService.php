<?php

namespace App\Services;

use App\Models\CommissionSetting;
use App\Models\Payment;
use App\Models\PaymentCommissionBreakdown;

class CommissionService
{
    /**
     * Calculate commission for a payment
     */
    public function calculate($packagePrice, $trainerId = null, $packageId = null, $packageCategory = null)
    {
        // Find applicable commission rule
        $rule = $this->findApplicableRule($trainerId, $packageId, $packageCategory);

        if (!$rule) {
            throw new \Exception('No applicable commission rule found');
        }

        $commission = 0;
        if ($rule->commission_type === 'percentage') {
            $commission = ($packagePrice * $rule->commission_value) / 100;
        } else {
            $commission = $rule->fixed_amount;
        }

        $trainerNetAmount = $packagePrice - $commission;

        return [
            'commission_rule_id' => $rule->id,
            'commission_type' => $rule->commission_type,
            'commission_value' => $rule->commission_value,
            'gross_amount' => $packagePrice,
            'commission_amount' => $commission,
            'trainer_net_amount' => $trainerNetAmount,
            'currency' => 'BDT',
        ];
    }

    /**
     * Record commission breakdown for payment
     */
    public function recordBreakdown($payment, $trainerId, $packageId, $breakdownData)
    {
        return PaymentCommissionBreakdown::create([
            'payment_id' => $payment->id,
            'trainer_id' => $trainerId,
            'package_id' => $packageId,
            'commission_setting_id' => $breakdownData['commission_rule_id'],
            'gross_amount' => $breakdownData['gross_amount'],
            'commission_type' => $breakdownData['commission_type'],
            'commission_value' => $breakdownData['commission_value'],
            'commission_amount' => $breakdownData['commission_amount'],
            'trainer_net_amount' => $breakdownData['trainer_net_amount'],
            'currency' => $breakdownData['currency'],
            'calculated_at' => now(),
        ]);
    }

    /**
     * Find applicable commission rule
     */
    private function findApplicableRule($trainerId = null, $packageId = null, $packageCategory = null)
    {
        return CommissionSetting::where('status', 'active')
            ->when($trainerId, fn($q) => $q->where('applies_to', 'trainer')->where('trainer_id', $trainerId))
            ->when($packageId, fn($q) => $q->where('applies_to', 'package')->where('package_id', $packageId))
            ->when($packageCategory, fn($q) => $q->where('applies_to', 'category')->where('package_category', $packageCategory))
            ->orWhere('applies_to', 'global')
            ->orderBy('priority', 'desc')
            ->first();
    }
}
