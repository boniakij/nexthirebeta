<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerWithdrawal extends Model
{
    protected $fillable = [
        'trainer_id', 'payout_method_id', 'amount', 'currency', 'status',
        'approved_at', 'processed_at', 'paid_at', 'rejected_at', 'rejection_reason',
        'transaction_reference', 'trainer_note', 'admin_note',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'approved_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    public function trainer(): BelongsTo { return $this->belongsTo(Trainer::class); }
}
