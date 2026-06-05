<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerAvailability extends Model
{
    use HasFactory;

    protected $table = 'trainer_availability';

    protected $fillable = [
        'trainer_id', 'date', 'start_time', 'end_time', 'is_booked',
    ];

    protected $casts = [
        'date' => 'date',
        'is_booked' => 'boolean',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
