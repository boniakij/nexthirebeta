<?php

namespace App\Services;

use App\Models\PointsLedger;
use App\Models\Student;
use Illuminate\Support\Facades\DB;

class XPService
{
    // XP Event types and their amounts
    const XP_EVENTS = [
        'first_interview' => 200,
        'interview_completed' => 100,
        'badge_unlocked' => 50,
        'level_up' => 75,
        'profile_completed' => 150,
        'skill_added' => 25,
        'review_given' => 30,
        'industry_ready_evaluation' => 300,
    ];

    // XP thresholds for each level
    const LEVEL_THRESHOLDS = [
        1 => 0,
        2 => 500,
        3 => 1200,
        4 => 2000,
        5 => 3000,
        6 => 4200,
        7 => 5500,
        8 => 7000,
        9 => 8700,
        10 => 10500,
    ];

    /**
     * Award XP to a student for an event
     */
    public function award(Student $student, string $eventType, int $referenceId = null): void
    {
        if (!isset(self::XP_EVENTS[$eventType])) {
            throw new \Exception("Unknown event type: $eventType");
        }

        DB::transaction(function () use ($student, $eventType, $referenceId) {
            $xpAmount = self::XP_EVENTS[$eventType];

            // Create ledger entry
            PointsLedger::create([
                'student_id' => $student->id,
                'xp_amount' => $xpAmount,
                'event_type' => $eventType,
                'reference_id' => $referenceId,
                'description' => $this->getEventDescription($eventType),
            ]);

            // Increment total XP
            $student->increment('total_xp', $xpAmount);

            // Recalculate level
            $newLevel = $this->calculateLevel($student->total_xp + $xpAmount);
            $oldLevel = $student->current_level;

            if ($newLevel > $oldLevel) {
                $student->update(['current_level' => $newLevel]);

                // Dispatch badge unlock checks
                \App\Jobs\CheckBadgeUnlocks::dispatch($student);

                // Award level-up XP
                $this->award($student, 'level_up');
            } else {
                $student->save();
            }

            // Update Redis leaderboards
            $this->updateLeaderboards($student);

            // Check for badge unlocks
            \App\Jobs\CheckBadgeUnlocks::dispatch($student);
        });
    }

    /**
     * Calculate level based on total XP
     */
    public function calculateLevel(int $totalXP): int
    {
        for ($level = 10; $level >= 1; $level--) {
            if ($totalXP >= self::LEVEL_THRESHOLDS[$level]) {
                return $level;
            }
        }

        return 1;
    }

    /**
     * Get XP thresholds
     */
    public function getXPThresholds(): array
    {
        return self::LEVEL_THRESHOLDS;
    }

    /**
     * Get event description
     */
    private function getEventDescription(string $eventType): string
    {
        $descriptions = [
            'first_interview' => 'First interview completed',
            'interview_completed' => 'Interview completed',
            'badge_unlocked' => 'Badge unlocked',
            'level_up' => 'Level up',
            'profile_completed' => 'Profile completed',
            'skill_added' => 'Skill added',
            'review_given' => 'Review given',
            'industry_ready_evaluation' => 'Evaluated as industry ready',
        ];

        return $descriptions[$eventType] ?? $eventType;
    }

    /**
     * Update leaderboards in Redis
     */
    private function updateLeaderboards(Student $student): void
    {
        // Update global leaderboard
        $this->updateGlobalLeaderboard($student);

        // Update country leaderboard
        if ($student->country_code) {
            $this->updateCountryLeaderboard($student);
        }
    }

    /**
     * Update global leaderboard
     */
    private function updateGlobalLeaderboard(Student $student): void
    {
        // Placeholder for Redis leaderboard update
        // In production: use Redis ZADD to update leaderboard
        // redis()->zadd('leaderboard:global', $student->total_xp, $student->id);
    }

    /**
     * Update country leaderboard
     */
    private function updateCountryLeaderboard(Student $student): void
    {
        // Placeholder for Redis leaderboard update
        // In production: use Redis ZADD to update country leaderboard
        // redis()->zadd('leaderboard:country:' . $student->country_code, $student->total_xp, $student->id);
    }
}
