<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Evaluation extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'interview_id', 'trainer_id', 'student_id', 'communication_score',
        'technical_score', 'confidence_score', 'problem_solving_score',
        'english_score', 'hr_readiness_score', 'overall_level', 'feedback_text',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function interview(): BelongsTo
    {
        return $this->belongsTo(Interview::class);
    }

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
