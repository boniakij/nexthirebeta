<?php

namespace App\Services;

use App\Models\Badge;
use App\Models\BadgeProgress;
use App\Models\UserBadge;
use App\Models\UserGamificationStats;
use Illuminate\Support\Facades\DB;

class BadgeUnlockService
{
    protected AwardXPService $xpService;

    public function __construct(AwardXPService $xpService)
    {
        $this->xpService = $xpService;
    }

    public function checkAndUnlockBadges(int $userId, string $role): array
    {
        return DB::transaction(function () use ($userId, $role) {
            $badges = Badge::active()
                ->where('applies_to', $role)
                ->get();

            $unlockedBadges = [];

            foreach ($badges as $badge) {
                // Skip if already unlocked
                if (UserBadge::where('user_id', $userId)
                    ->where('badge_id', $badge->id)
                    ->exists()) {
                    continue;
                }

                // Check if condition is met
                if ($this->isConditionMet($userId, $badge)) {
                    $this->unlockBadge($userId, $badge, $role);
                    $unlockedBadges[] = $badge;
                }
            }

            return $unlockedBadges;
        });
    }

    private function isConditionMet(int $userId, Badge $badge): bool
    {
        $condition = $badge->unlock_condition_json;

        if (!$condition || !isset($condition['type'])) {
            return false;
        }

        $type = $condition['type'];

        return match ($type) {
            'session_count' => $this->checkSessionCount($userId, $condition),
            'domain_session_count' => $this->checkDomainSessionCount($userId, $condition),
            'evaluation_score_count' => $this->checkEvaluationScoreCount($userId, $condition),
            'trainer_rating' => $this->checkTrainerRating($userId, $condition),
            'profile_complete' => $this->checkProfileComplete($userId),
            'resume_uploaded' => $this->checkResumeUploaded($userId),
            'linkedin_added' => $this->checkLinkedInAdded($userId),
            'login_streak' => $this->checkLoginStreak($userId, $condition),
            'evaluation_status' => $this->checkEvaluationStatus($userId, $condition),
            'country_rank' => $this->checkCountryRank($userId, $condition),
            'global_rank' => $this->checkGlobalRank($userId, $condition),
            'trainer_verified' => $this->checkTrainerVerified($userId),
            'trainer_session_count' => $this->checkTrainerSessionCount($userId, $condition),
            'trainer_package_count' => $this->checkTrainerPackageCount($userId, $condition),
            'five_star_reviews' => $this->checkFiveStarReviews($userId, $condition),
            'trainer_earnings' => $this->checkTrainerEarnings($userId, $condition),
            default => false,
        };
    }

    private function checkSessionCount(int $userId, array $condition): bool
    {
        $value = $condition['value'] ?? 0;
        $sessionCount = \DB::table('interviews')
            ->where('student_id', $userId)
            ->where('status', 'completed')
            ->count();
        return $sessionCount >= $value;
    }

    private function checkDomainSessionCount(int $userId, array $condition): bool
    {
        $domain = $condition['domain'] ?? '';
        $value = $condition['value'] ?? 0;

        $sessionCount = \DB::table('interviews')
            ->join('packages', 'interviews.package_id', '=', 'packages.id')
            ->where('interviews.student_id', $userId)
            ->where('interviews.status', 'completed')
            ->where('packages.category', $domain)
            ->count();

        return $sessionCount >= $value;
    }

    private function checkEvaluationScoreCount(int $userId, array $condition): bool
    {
        $scoreField = $condition['score_field'] ?? '';
        $scoreValue = $condition['score_value'] ?? 0;
        $count = $condition['count'] ?? 0;

        $scoringCount = \DB::table('evaluations')
            ->where('student_id', $userId)
            ->where($scoreField, '>=', $scoreValue)
            ->count();

        return $scoringCount >= $count;
    }

    private function checkTrainerRating(int $userId, array $condition): bool
    {
        $minRating = $condition['average_rating'] ?? 4.8;
        $minSessions = $condition['min_sessions'] ?? 0;

        $trainer = \DB::table('trainers')
            ->where('user_id', $userId)
            ->first();

        if (!$trainer) {
            return false;
        }

        $sessionCount = \DB::table('interviews')
            ->where('trainer_id', $trainer->id)
            ->where('status', 'completed')
            ->count();

        if ($sessionCount < $minSessions) {
            return false;
        }

        $avgRating = \DB::table('reviews')
            ->where('trainer_id', $trainer->id)
            ->avg('rating') ?? 0;

        return $avgRating >= $minRating;
    }

    private function unlockBadge(int $userId, Badge $badge, string $role): void
    {
        // Create user badge record
        UserBadge::create([
            'user_id' => $userId,
            'badge_id' => $badge->id,
            'role' => $role,
            'unlocked_at' => now(),
            'xp_awarded' => $badge->xp_reward,
        ]);

        // Award badge XP
        try {
            $this->xpService->awardXP(
                $userId,
                $role,
                'badge_unlock',
                "Unlocked {$badge->name} badge",
                'badge',
                $badge->id
            );
        } catch (\Exception $e) {
            // Log but don't fail
        }

        // Update badge count
        $stats = UserGamificationStats::firstOrCreate(['user_id' => $userId]);
        $stats->increment('badges_count');

        // Send notification (TODO)
    }

    private function checkProfileComplete(int $userId): bool
    {
        $user = \DB::table('users')->find($userId);
        return $user && !empty($user->phone) && !empty($user->profile_photo);
    }

    private function checkResumeUploaded(int $userId): bool
    {
        return \DB::table('resumes')
            ->where('user_id', $userId)
            ->exists();
    }

    private function checkLinkedInAdded(int $userId): bool
    {
        $user = \DB::table('users')->find($userId);
        return $user && !empty($user->linkedin_url);
    }

    private function checkLoginStreak(int $userId, array $condition): bool
    {
        $days = $condition['days'] ?? 0;
        $stats = UserGamificationStats::where('user_id', $userId)->first();
        return $stats && $stats->streak_days >= $days;
    }

    private function checkEvaluationStatus(int $userId, array $condition): bool
    {
        $status = $condition['status'] ?? '';
        return \DB::table('evaluations')
            ->where('student_id', $userId)
            ->where('overall_status', $status)
            ->exists();
    }

    private function checkCountryRank(int $userId, array $condition): bool
    {
        $country = $condition['country'] ?? '';
        $rank = $condition['rank'] ?? 100;

        $stats = UserGamificationStats::where('user_id', $userId)->first();
        return $stats && $stats->country_rank && $stats->country_rank <= $rank;
    }

    private function checkGlobalRank(int $userId, array $condition): bool
    {
        $rank = $condition['rank'] ?? 500;
        $stats = UserGamificationStats::where('user_id', $userId)->first();
        return $stats && $stats->global_rank && $stats->global_rank <= $rank;
    }

    private function checkTrainerVerified(int $userId): bool
    {
        return \DB::table('trainers')
            ->where('user_id', $userId)
            ->where('status', 'approved')
            ->exists();
    }

    private function checkTrainerSessionCount(int $userId, array $condition): bool
    {
        $value = $condition['value'] ?? 0;
        $trainer = \DB::table('trainers')
            ->where('user_id', $userId)
            ->first();

        if (!$trainer) {
            return false;
        }

        $sessionCount = \DB::table('interviews')
            ->where('trainer_id', $trainer->id)
            ->where('status', 'completed')
            ->count();

        return $sessionCount >= $value;
    }

    private function checkTrainerPackageCount(int $userId, array $condition): bool
    {
        $value = $condition['value'] ?? 0;
        $trainer = \DB::table('trainers')
            ->where('user_id', $userId)
            ->first();

        if (!$trainer) {
            return false;
        }

        $packageCount = \DB::table('packages')
            ->where('trainer_id', $trainer->id)
            ->where('status', 'active')
            ->count();

        return $packageCount >= $value;
    }

    private function checkFiveStarReviews(int $userId, array $condition): bool
    {
        $count = $condition['count'] ?? 0;
        $trainer = \DB::table('trainers')
            ->where('user_id', $userId)
            ->first();

        if (!$trainer) {
            return false;
        }

        $fiveStarCount = \DB::table('reviews')
            ->where('trainer_id', $trainer->id)
            ->where('rating', 5)
            ->count();

        return $fiveStarCount >= $count;
    }

    private function checkTrainerEarnings(int $userId, array $condition): bool
    {
        $amount = $condition['amount'] ?? 0;
        $trainer = \DB::table('trainers')
            ->where('user_id', $userId)
            ->first();

        if (!$trainer) {
            return false;
        }

        $totalEarnings = \DB::table('trainer_earnings')
            ->where('trainer_id', $trainer->id)
            ->sum('amount') ?? 0;

        return $totalEarnings >= $amount;
    }
}
