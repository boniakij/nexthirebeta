<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentCommissionBreakdown extends Model
{
    protected $fillable = ['payment_id', 'trainer_id', 'package_id', 'commission_setting_id', 'gross_amount', 'commission_type', 'commission_value', 'commission_amount', 'trainer_net_amount', 'currency', 'calculated_at'];

    protected $casts = ['gross_amount' => 'decimal:2', 'commission_value' => 'decimal:2', 'commission_amount' => 'decimal:2', 'trainer_net_amount' => 'decimal:2', 'calculated_at' => 'datetime'];

    public function payment(): BelongsTo { return $this->belongsTo(Payment::class); }
    public function trainer(): BelongsTo { return $this->belongsTo(Trainer::class); }
}
