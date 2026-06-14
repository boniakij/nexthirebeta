<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerWallet extends Model
{
    protected $fillable = [
        'trainer_id',
        'currency',
        'total_earned',
        'available_balance',
        'pending_balance',
        'withdrawn_amount',
        'platform_commission_total',
    ];

    protected $casts = [
        'total_earned' => 'decimal:2',
        'available_balance' => 'decimal:2',
        'pending_balance' => 'decimal:2',
        'withdrawn_amount' => 'decimal:2',
        'platform_commission_total' => 'decimal:2',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
