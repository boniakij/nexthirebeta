<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class InterviewBooking extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'student_id',
        'package_id',
        'booking_date',
        'status',
        'paid',
        'amount_paid',
        'student_notes',
        'trainer_feedback',
        'rating',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'paid' => 'boolean',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(InterviewPackage::class, 'package_id');
    }
}
