<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\Student;
use App\Models\UserBadge;
use Illuminate\Support\Facades\DB;

class BadgeService
{
    protected XPService $xpService;

    public function __construct(XPService $xpService)
    {
        $this->xpService = $xpService;
    }

    /**
     * Check and unlock badges for a student
     */
    public function checkUnlocks(Student $student): void
    {
        DB::transaction(function () use ($student) {
            // Get all badges not yet earned
            $earnedBadgeIds = $student->badges()->pluck('badge_id')->toArray();
            $unlockedBadges = Badge::whereNotIn('id', $earnedBadgeIds)->get();

            foreach ($unlockedBadges as $badge) {
                if ($this->conditionMet($student, $badge->unlock_condition)) {
                    // Attach badge
                    UserBadge::create([
                        'student_id' => $student->id,
                        'badge_id' => $badge->id,
                    ]);

                    // Award XP
                    $this->xpService->award($student, 'badge_unlocked', $badge->id);

                    // Notify student
                    \App\Jobs\SendNotification::dispatch(
                        $student->user_id,
                        'Badge Unlocked!',
                        "You've unlocked the '{$badge->name}' badge!",
                        ['badge_id' => $badge->id, 'icon' => $badge->icon_path]
                    );

                    // Fire event
                    // event(new BadgeUnlocked($student, $badge));
                }
            }
        });
    }

    /**
     * Check if badge unlock condition is met
     */
    public function conditionMet(Student $student, array $condition): bool
    {
        $conditionType = $condition['type'] ?? null;

        return match ($conditionType) {
            'xp_threshold' => $this->xpInLastDays($student, $condition['xp'] ?? 0, $condition['days'] ?? 365),
            'session_count' => $student->interviews()->count() >= ($condition['count'] ?? 0),
            'average_score' => $this->avgScoreInCategory($student, $condition['category'] ?? null) >= ($condition['min_score'] ?? 0),
            'country_rank' => $this->getCountryRank($student) <= ($condition['rank'] ?? 999999),
            'profile_completion' => $student->profile_completion >= ($condition['percentage'] ?? 100),
            'streak_days' => $student->streak_days >= ($condition['days'] ?? 0),
            default => false,
        };
    }

    /**
     * Check if student earned XP in last N days
     */
    private function xpInLastDays(Student $student, int $xp, int $days): bool
    {
        $totalXp = $student->pointsLedger()
            ->where('created_at', '>=', now()->subDays($days))
            ->sum('xp_amount');

        return $totalXp >= $xp;
    }

    /**
     * Get student's country rank
     */
    private function getCountryRank(Student $student): int
    {
        $rank = Student::where('country_code', $student->country_code)
            ->where('total_xp', '>', $student->total_xp)
            ->count();

        return $rank + 1;
    }

    /**
     * Get average evaluation score in a category
     */
    private function avgScoreInCategory(Student $student, ?string $category): float
    {
        if (!$category) {
            return 0;
        }

        $evaluations = $student->evaluations()->get();

        if ($evaluations->isEmpty()) {
            return 0;
        }

        // Calculate average score based on category
        return match ($category) {
            'communication' => $evaluations->avg('communication_score'),
            'technical' => $evaluations->avg('technical_score'),
            'confidence' => $evaluations->avg('confidence_score'),
            'problem_solving' => $evaluations->avg('problem_solving_score'),
            'english' => $evaluations->avg('english_score'),
            'hr_readiness' => $evaluations->avg('hr_readiness_score'),
            default => 0,
        };
    }
}
