<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CommissionSetting extends Model
{
    protected $fillable = [
        'rule_name', 'commission_type', 'commission_value', 'fixed_amount',
        'applies_to', 'trainer_id', 'package_id', 'package_category',
        'currency', 'priority', 'status', 'starts_at', 'ends_at',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'commission_value' => 'decimal:2',
        'fixed_amount' => 'decimal:2',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
    ];
}
