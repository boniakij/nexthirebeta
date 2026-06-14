<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerRecurringAvailabilityRule extends Model
{
    protected $fillable = [
        'trainer_id',
        'rule_name',
        'repeat_type',
        'repeat_days',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'slot_duration_minutes',
        'buffer_minutes',
        'status',
    ];

    protected $casts = [
        'repeat_days' => 'json',
        'start_date' => 'date',
        'end_date' => 'date',
        'slot_duration_minutes' => 'integer',
        'buffer_minutes' => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
