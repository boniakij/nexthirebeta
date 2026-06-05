<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PointsLedger extends Model
{
    use HasFactory;

    const UPDATED_AT = null;

    protected $table = 'points_ledger';

    protected $fillable = [
        'student_id', 'xp_amount', 'event_type', 'reference_id', 'description',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(Student::class);
    }
}
