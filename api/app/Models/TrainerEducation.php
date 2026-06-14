<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerEducation extends Model
{
    protected $fillable = [
        'trainer_id',
        'degree',
        'institution_name',
        'field_of_study',
        'start_year',
        'graduation_year',
        'grade',
        'description',
        'sort_order',
    ];

    protected $casts = [
        'start_year' => 'integer',
        'graduation_year' => 'integer',
        'sort_order' => 'integer',
    ];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
