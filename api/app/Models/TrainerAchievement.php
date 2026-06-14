<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerAchievement extends Model
{
    protected $fillable = [
        'trainer_id',
        'title',
        'type',
        'organization',
        'role',
        'achievement_date',
        'description',
        'result_impact',
        'project_url',
        'attachment_file',
        'is_public',
        'sort_order',
    ];

    protected $casts = [
        'achievement_date' => 'date',
        'is_public' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
