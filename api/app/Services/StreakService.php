<?php

namespace App\Services;

use App\Models\UserGamificationStats;
use Carbon\Carbon;

class StreakService
{
    protected AwardXPService $xpService;

    public function __construct(AwardXPService $xpService)
    {
        $this->xpService = $xpService;
    }

    public function recordLogin(int $userId): void
    {
        $stats = UserGamificationStats::firstOrCreate(
            ['user_id' => $userId],
            ['role' => 'student', 'streak_days' => 0]
        );

        $today = Carbon::today();
        $lastLogin = $stats->last_login_date ? Carbon::parse($stats->last_login_date) : null;

        if ($lastLogin?->isToday()) {
            return; // Already logged in today
        }

        if ($lastLogin && $lastLogin->addDay()->isToday()) {
            // Streak continues
            $stats->increment('streak_days');

            // Check streak bonuses
            if ($stats->streak_days === 7) {
                try {
                    $this->xpService->awardXP(
                        $userId,
                        'student',
                        'streak_7_day',
                        '7-day login streak bonus',
                        'streak',
                        7
                    );
                } catch (\Exception $e) {
                    \Log::error('Failed to award 7-day streak bonus', ['error' => $e->getMessage()]);
                }
            } elseif ($stats->streak_days === 30) {
                try {
                    $this->xpService->awardXP(
                        $userId,
                        'student',
                        'streak_30_day',
                        '30-day login streak bonus',
                        'streak',
                        30
                    );
                } catch (\Exception $e) {
                    \Log::error('Failed to award 30-day streak bonus', ['error' => $e->getMessage()]);
                }
            }
        } else {
            // Streak broken or first login
            $stats->streak_days = 1;
        }

        $stats->update(['last_login_date' => $today]);
    }

    public function resetStreak(int $userId): void
    {
        UserGamificationStats::where('user_id', $userId)
            ->update(['streak_days' => 0]);
    }

    public function getStreak(int $userId): int
    {
        return UserGamificationStats::where('user_id', $userId)
            ->value('streak_days') ?? 0;
    }
}
