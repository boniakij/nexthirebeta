<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerEarningLedger extends Model
{
    protected $table = 'trainer_earning_ledger';

    protected $fillable = [
        'trainer_id', 'student_id', 'booking_id', 'interview_id', 'payment_id',
        'gross_amount', 'commission_amount', 'net_amount', 'currency', 'status', 'available_at',
    ];

    protected $casts = [
        'gross_amount' => 'decimal:2',
        'commission_amount' => 'decimal:2',
        'net_amount' => 'decimal:2',
        'available_at' => 'datetime',
    ];

    public function trainer(): BelongsTo { return $this->belongsTo(Trainer::class); }
    public function interview(): BelongsTo { return $this->belongsTo(Interview::class); }
    public function payment(): BelongsTo { return $this->belongsTo(Payment::class); }
}
