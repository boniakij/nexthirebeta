<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerAvailabilitySlot extends Model
{
    protected $fillable = [
        'trainer_id',
        'date',
        'start_time',
        'end_time',
        'slot_duration_minutes',
        'status',
        'booking_id',
        'reserved_until',
    ];

    protected $casts = [
        'date' => 'date',
        'start_time' => 'datetime:H:i',
        'end_time' => 'datetime:H:i',
        'slot_duration_minutes' => 'integer',
        'reserved_until' => 'datetime',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }
}
