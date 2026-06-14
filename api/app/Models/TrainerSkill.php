<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerSkill extends Model
{
    protected $fillable = [
        'trainer_id',
        'skill_name',
        'skill_category',
        'skill_level',
        'years_experience',
        'is_featured',
        'sort_order',
    ];

    protected $casts = [
        'years_experience' => 'integer',
        'is_featured' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
