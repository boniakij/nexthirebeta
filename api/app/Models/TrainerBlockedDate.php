<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerBlockedDate extends Model
{
    protected $fillable = [
        'trainer_id',
        'block_type',
        'date',
        'start_time',
        'end_time',
        'is_full_day',
        'reason',
        'cancel_existing_bookings',
    ];

    protected $casts = [
        'date' => 'date',
        'is_full_day' => 'boolean',
        'cancel_existing_bookings' => 'boolean',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
