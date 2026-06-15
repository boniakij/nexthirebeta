<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class InterviewPackage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'trainer_id',
        'title',
        'category',
        'interview_type',
        'difficulty_level',
        'language',
        'short_description',
        'description',
        'number_of_sessions',
        'price',
        'discount_price',
        'session_duration',
        'package_validity',
        'max_students',
        'session_type',
        'days_of_week',
        'session_time',
        'timezone',
        'start_date',
        'end_date',
        'repeat_weekly',
        'includes_cv_review',
        'includes_career_guideline',
        'includes_mock_interview',
        'status',
        'target_level',
        'tags',
        'session_mode',
        'includes_written_feedback',
        'preparation_instructions',
        'currency',
        'required_documents',
        'custom_questions',
        'availability_scope',
    ];

    protected $casts = [
        'days_of_week' => 'array',
        'repeat_weekly' => 'boolean',
        'includes_cv_review' => 'boolean',
        'includes_career_guideline' => 'boolean',
        'includes_mock_interview' => 'boolean',
        'start_date' => 'date',
        'end_date' => 'date',
        'tags' => 'array',
        'required_documents' => 'array',
        'custom_questions' => 'array',
        'includes_written_feedback' => 'boolean',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(InterviewBooking::class, 'package_id');
    }

    public function getIsDiscountedAttribute(): bool
    {
        return $this->discount_price !== null && $this->discount_price < $this->price;
    }

    public function getDiscountPercentageAttribute(): float
    {
        if (!$this->is_discounted) {
            return 0;
        }

        return (($this->price - $this->discount_price) / $this->price) * 100;
    }

    public function getFinalPriceAttribute(): float
    {
        return $this->discount_price ?? $this->price;
    }
}
