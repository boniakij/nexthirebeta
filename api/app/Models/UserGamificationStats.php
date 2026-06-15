<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserGamificationStats extends Model
{
    use HasFactory;

    protected $table = 'user_gamification_stats';

    protected $fillable = [
        'user_id',
        'role',
        'total_xp',
        'current_level',
        'badges_count',
        'country_rank',
        'global_rank',
        'streak_days',
        'last_login_date',
    ];

    protected $casts = [
        'last_login_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeTopRanked($query, $limit = 100)
    {
        return $query->orderBy('total_xp', 'desc')->limit($limit);
    }
}
