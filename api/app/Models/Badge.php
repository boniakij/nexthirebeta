<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Badge extends Model
{
    use HasFactory;

    protected $table = 'badges';

    protected $fillable = [
        'slug',
        'name',
        'description',
        'category',
        'applies_to',
        'icon_path',
        'xp_reward',
        'unlock_condition_json',
        'status',
        'sort_order',
    ];

    protected $casts = [
        'unlock_condition_json' => 'array',
    ];

    public function userBadges(): HasMany
    {
        return $this->hasMany(UserBadge::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForStudent($query)
    {
        return $query->where('applies_to', 'student');
    }

    public function scopeForTrainer($query)
    {
        return $query->where('applies_to', 'trainer');
    }
}
