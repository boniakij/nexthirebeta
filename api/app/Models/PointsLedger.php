<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PointsLedger extends Model
{
    use HasFactory;

    protected $table = 'points_ledger';

    const UPDATED_AT = null;

    protected $fillable = [
        'user_id',
        'role',
        'student_id',
        'trainer_id',
        'xp_amount',
        'event_type',
        'event_label',
        'reference_type',
        'reference_id',
        'metadata_json',
    ];

    protected $casts = [
        'metadata_json' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeByRole($query, $role)
    {
        return $query->where('role', $role);
    }
}
