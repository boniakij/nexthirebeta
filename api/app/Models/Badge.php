<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $fillable = [
        'slug', 'name', 'description', 'icon_path', 'xp_reward',
        'unlock_condition', 'category',
    ];

    protected $casts = [
        'unlock_condition' => 'array',
    ];

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }
}
