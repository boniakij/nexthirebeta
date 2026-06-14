<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TrainerCertification extends Model
{
    protected $fillable = ['trainer_id', 'certification_name', 'issuing_organization', 'certificate_url', 'issue_date', 'expiry_date'];

    protected $casts = ['issue_date' => 'date', 'expiry_date' => 'date'];

    public function trainer(): BelongsTo
    {
        return $this->belongsTo(Trainer::class);
    }
}
