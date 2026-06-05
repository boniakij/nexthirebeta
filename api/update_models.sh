#!/bin/bash

# This script updates all model files with proper relationships and fillable properties

# Update Student model
cat > app/Models/Student.php << 'EOF'
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
        'user_id',
        'full_name',
        'university',
        'department',
        'graduation_year',
        'skills',
        'preferred_job_role',
        'linkedin_url',
        'github_url',
        'resume_path',
        'profile_completion',
        'total_xp',
        'current_level',
        'streak_days',
        'last_active_at',
        'country_code',
    ];

    protected $casts = [
        'skills' => 'array',
        'last_active_at' => 'datetime',
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
EOF

# Update Trainer model
cat > app/Models/Trainer.php << 'EOF'
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
        'user_id',
        'full_name',
        'bio',
        'expertise_domains',
        'years_experience',
        'certifications',
        'company_experience',
        'hourly_rate',
        'average_rating',
        'total_reviews',
        'total_sessions',
        'is_approved',
        'approved_at',
        'payout_info',
        'country_code',
    ];

    protected $casts = [
        'expertise_domains' => 'array',
        'certifications' => 'array',
        'company_experience' => 'array',
        'payout_info' => 'array',
        'approved_at' => 'datetime',
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
EOF

# Update Company model
cat > app/Models/Company.php << 'EOF'
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'company_name',
        'company_website',
        'industry',
        'company_size',
        'registration_number',
        'kyc_document_path',
        'kyc_status',
        'is_verified',
        'verified_at',
        'hr_contact_name',
        'hr_contact_email',
        'logo_path',
        'country_code',
    ];

    protected $casts = [
        'verified_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function campaigns(): HasMany
    {
        return $this->hasMany(HiringCampaign::class);
    }
}
EOF

echo "Models updated successfully!"

