<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HiringCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_id', 'title', 'description', 'position', 'salary_min', 'salary_max',
        'requirements', 'is_active', 'deadline',
    ];

    protected $casts = [
        'requirements' => 'array',
        'is_active' => 'boolean',
        'deadline' => 'datetime',
    ];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function candidates(): HasMany
    {
        return $this->hasMany(CampaignCandidate::class);
    }
}
