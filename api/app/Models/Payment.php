<?php

namespace App\Models;

use App\Enums\PaymentStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'payer_id', 'payee_id', 'interview_id', 'amount', 'commission',
        'currency', 'gateway', 'gateway_txn_id', 'status', 'invoice_path',
        'payout_processed_at',
    ];

    protected $casts = [
        'status' => PaymentStatus::class,
        'payout_processed_at' => 'datetime',
    ];

    public function payer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payer_id');
    }

    public function payee(): BelongsTo
    {
        return $this->belongsTo(User::class, 'payee_id');
    }

    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }
}
