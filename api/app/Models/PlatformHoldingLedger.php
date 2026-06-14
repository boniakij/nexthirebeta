<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PlatformHoldingLedger extends Model
{
    protected $table = 'platform_holding_ledger';

    protected $fillable = ['payment_id', 'booking_id', 'interview_id', 'trainer_id', 'student_id', 'gross_amount', 'currency', 'status', 'held_at', 'released_at'];

    protected $casts = ['gross_amount' => 'decimal:2', 'held_at' => 'datetime', 'released_at' => 'datetime'];

    public function payment(): BelongsTo { return $this->belongsTo(Payment::class); }
    public function trainer(): BelongsTo { return $this->belongsTo(Trainer::class); }
}
