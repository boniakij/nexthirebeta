<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'full_name', 'university', 'department', 'graduation_year', 'skills',
        'preferred_job_role', 'linkedin_url', 'github_url', 'resume_path', 'profile_completion',
        'total_xp', 'current_level', 'streak_days', 'last_active_at', 'country_code',
        'notification_settings', 'privacy_settings',
    ];

    protected $casts = [
        'skills' => 'array',
        'notification_settings' => 'array',
        'privacy_settings' => 'array',
        'last_active_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function interviews(): HasMany
    {
        return $this->hasMany(Interview::class);
    }

    public function evaluations(): HasMany
    {
        return $this->hasMany(Evaluation::class);
    }

    public function badges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }

    public function pointsLedger(): HasMany
    {
        return $this->hasMany(PointsLedger::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function campaignCandidates(): HasMany
    {
        return $this->hasMany(CampaignCandidate::class);
    }
}
