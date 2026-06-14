<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerWeeklySchedule extends Model
{
    protected $fillable = [
        'trainer_id',
        'day_of_week',
        'is_available',
        'start_time',
        'end_time',
        'slot_duration_minutes',
        'buffer_minutes',
        'timezone',
        'status',
    ];

    protected $casts = [
        'day_of_week' => 'integer',
        'is_available' => 'boolean',
        'slot_duration_minutes' => 'integer',
        'buffer_minutes' => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public static function getDayName($dayOfWeek)
    {
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return $days[$dayOfWeek] ?? null;
    }
}
