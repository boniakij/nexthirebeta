<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class XPRule extends Model
{
    use HasFactory;

    protected $table = 'xp_rules';

    protected $fillable = [
        'rule_name',
        'applies_to',
        'event_type',
        'xp_amount',
        'frequency_limit',
        'max_award_per_day',
        'status',
        'created_by',
        'updated_by',
    ];

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByEventType($query, $eventType)
    {
        return $query->where('event_type', $eventType);
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
