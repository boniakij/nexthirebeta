<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CampaignCandidate extends Model
{
    use HasFactory;

    protected $fillable = [
        'campaign_id', 'student_id', 'status', 'applied_at',
    ];

    protected $casts = [
        'applied_at' => 'datetime',
    ];

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(HiringCampaign::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
