<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BadgeProgress extends Model
{
    use HasFactory;

    protected $table = 'badge_progress';

    protected $fillable = [
        'user_id',
        'badge_id',
        'current_value',
        'target_value',
        'is_completed',
        'last_checked_at',
    ];

    protected $casts = [
        'is_completed' => 'boolean',
        'last_checked_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function badge(): BelongsTo
    {
        return $this->belongsTo(Badge::class);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeIncomplete($query)
    {
        return $query->where('is_completed', false);
    }
}
