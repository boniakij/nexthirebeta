<?php

namespace App\Services;

use App\Models\PointsLedger;
use App\Models\UserGamificationStats;
use App\Models\XPRule;
use App\Models\XPLevel;
use Illuminate\Support\Facades\DB;

class AwardXPService
{
    public function awardXP(
        int $userId,
        string $role,
        string $eventType,
        string $eventLabel,
        string $referenceType = null,
        int $referenceId = null,
        array $metadata = null
    ): PointsLedger {
        return DB::transaction(function () use (
            $userId,
            $role,
            $eventType,
            $eventLabel,
            $referenceType,
            $referenceId,
            $metadata
        ) {
            // Get active XP rule
            $rule = XPRule::active()
                ->byEventType($eventType)
                ->first();

            if (!$rule) {
                throw new \Exception("No active XP rule found for event: {$eventType}");
            }

            // Check frequency limit
            if ($rule->frequency_limit === 'once_per_day') {
                $today = now()->startOfDay();
                $exists = PointsLedger::where('user_id', $userId)
                    ->where('event_type', $eventType)
                    ->where('created_at', '>=', $today)
                    ->exists();

                if ($exists) {
                    throw new \Exception("XP already awarded today for {$eventType}");
                }
            }

            // Create ledger entry
            $ledger = PointsLedger::create([
                'user_id' => $userId,
                'role' => $role,
                'xp_amount' => $rule->xp_amount,
                'event_type' => $eventType,
                'event_label' => $eventLabel,
                'reference_type' => $referenceType,
                'reference_id' => $referenceId,
                'metadata_json' => $metadata,
            ]);

            // Update gamification stats
            $stats = UserGamificationStats::firstOrCreate(
                ['user_id' => $userId],
                ['role' => $role, 'total_xp' => 0, 'current_level' => 1]
            );

            $stats->increment('total_xp', $rule->xp_amount);
            $this->recalculateLevel($stats);

            return $ledger;
        });
    }

    private function recalculateLevel(UserGamificationStats $stats): void
    {
        $nextLevel = XPLevel::where('xp_required', '<=', $stats->total_xp)
            ->orderBy('xp_required', 'desc')
            ->first();

        if ($nextLevel) {
            $stats->update(['current_level' => $nextLevel->level_number]);
        }
    }
}
