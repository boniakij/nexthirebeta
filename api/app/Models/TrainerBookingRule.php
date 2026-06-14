<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerBookingRule extends Model
{
    protected $fillable = [
        'trainer_id',
        'minimum_notice_hours',
        'max_booking_days_ahead',
        'allow_same_day_booking',
        'allow_reschedule',
        'max_reschedule_count',
        'reschedule_deadline_hours',
        'allow_cancellation',
        'cancellation_deadline_hours',
        'auto_confirm_paid_bookings',
        'timezone',
    ];

    protected $casts = [
        'minimum_notice_hours' => 'integer',
        'max_booking_days_ahead' => 'integer',
        'allow_same_day_booking' => 'boolean',
        'allow_reschedule' => 'boolean',
        'max_reschedule_count' => 'integer',
        'reschedule_deadline_hours' => 'integer',
        'allow_cancellation' => 'boolean',
        'cancellation_deadline_hours' => 'integer',
        'auto_confirm_paid_bookings' => 'boolean',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
