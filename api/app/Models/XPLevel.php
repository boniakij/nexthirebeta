<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XPLevel extends Model
{
    use HasFactory;

    protected $table = 'xp_levels';

    protected $fillable = [
        'level_number',
        'level_name',
        'xp_required',
        'badge_icon',
        'description',
    ];

    public function scopeByNumber($query, $number)
    {
        return $query->where('level_number', $number);
    }
}
