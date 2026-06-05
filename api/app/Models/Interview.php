<?php

namespace App\Models;

use App\Enums\InterviewStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Interview extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'trainer_id', 'package_id', 'availability_id',
        'scheduled_at', 'duration_minutes', 'status', 'meeting_link',
        'meeting_id', 'agora_channel', 'completed_at', 'cancelled_at',
        'cancelled_reason', 'xp_awarded',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'completed_at' => 'datetime',
        'cancelled_at' => 'datetime',
        'status' => InterviewStatus::class,
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    public function availability(): BelongsTo
    {
        return $this->belongsTo(TrainerAvailability::class);
    }

    public function evaluation(): HasOne
    {
        return $this->hasOne(Evaluation::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
