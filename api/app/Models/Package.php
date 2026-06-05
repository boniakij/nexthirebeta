<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Package extends Model
{
    use HasFactory;

    protected $fillable = [
        'trainer_id', 'title', 'description', 'price', 'session_count',
        'duration_minutes', 'interview_type', 'domain', 'difficulty',
        'language', 'is_live', 'includes_cv_review', 'is_active',
        'total_bookings',
    ];

    protected $casts = [
        'is_live' => 'boolean',
        'includes_cv_review' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }
}
