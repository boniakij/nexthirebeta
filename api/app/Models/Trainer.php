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
        'user_id', 'full_name', 'display_name', 'profile_photo_url', 'gender', 'date_of_birth',
        'phone_number', 'location', 'time_zone', 'preferred_language', 'professional_title',
        'current_company', 'current_designation', 'industry', 'trainer_type', 'headline', 'bio',
        'booking_value_statement', 'expertise_domains', 'target_student_levels', 'preferred_session_modes',
        'years_experience', 'highest_degree', 'institution_name', 'graduation_year', 'field_of_study',
        'languages', 'social_links', 'profile_status', 'is_available_for_booking', 'is_featured',
        'accepting_new_students', 'response_time', 'cancellation_policy', 'refund_policy',
        'admin_review_status', 'admin_rejection_reason', 'verified_at', 'profile_submitted_at',
        'hourly_rate', 'average_rating', 'total_reviews', 'total_sessions', 'is_approved',
        'approved_at', 'payout_info', 'country_code',
    ];

    protected $casts = [
        'expertise_domains' => 'array',
        'target_student_levels' => 'array',
        'preferred_session_modes' => 'array',
        'languages' => 'array',
        'social_links' => 'array',
        'payout_info' => 'array',
        'date_of_birth' => 'date',
        'verified_at' => 'datetime',
        'profile_submitted_at' => 'datetime',
        'approved_at' => 'datetime',
        'is_approved' => 'boolean',
        'is_available_for_booking' => 'boolean',
        'is_featured' => 'boolean',
        'accepting_new_students' => 'boolean',
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

    public function experiences(): HasMany
    {
        return $this->hasMany(TrainerExperience::class);
    }

    public function certifications(): HasMany
    {
        return $this->hasMany(TrainerCertification::class);
    }

    public function skills(): HasMany
    {
        return $this->hasMany(TrainerSkill::class);
    }

    public function educations(): HasMany
    {
        return $this->hasMany(TrainerEducation::class);
    }

    public function achievements(): HasMany
    {
        return $this->hasMany(TrainerAchievement::class);
    }

    public function weeklySchedules(): HasMany
    {
        return $this->hasMany(TrainerWeeklySchedule::class);
    }

    public function availabilitySlots(): HasMany
    {
        return $this->hasMany(TrainerAvailabilitySlot::class);
    }

    public function recurringAvailabilityRules(): HasMany
    {
        return $this->hasMany(TrainerRecurringAvailabilityRule::class);
    }

    public function blockedDates(): HasMany
    {
        return $this->hasMany(TrainerBlockedDate::class);
    }

    public function bookingRules()
    {
        return $this->hasOne(TrainerBookingRule::class);
    }
}
