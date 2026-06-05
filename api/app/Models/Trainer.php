<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Trainer extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'full_name', 'bio', 'expertise_domains', 'years_experience',
        'certifications', 'company_experience', 'hourly_rate', 'average_rating',
        'total_reviews', 'total_sessions', 'is_approved', 'approved_at',
        'payout_info', 'country_code',
    ];

    protected $casts = [
        'expertise_domains' => 'array',
        'certifications' => 'array',
        'company_experience' => 'array',
        'payout_info' => 'array',
        'approved_at' => 'datetime',
        'is_approved' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function packages(): HasMany
    {
        return $this->hasMany(Package::class);
    }

    public function availability(): HasMany
    {
        return $this->hasMany(TrainerAvailability::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
}
