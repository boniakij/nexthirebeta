<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerExperience extends Model
{
    protected $fillable = ['trainer_id', 'company_name', 'job_title', 'employment_type', 'start_date', 'end_date', 'is_current', 'description'];

    protected $casts = ['start_date' => 'date', 'end_date' => 'date', 'is_current' => 'boolean'];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
