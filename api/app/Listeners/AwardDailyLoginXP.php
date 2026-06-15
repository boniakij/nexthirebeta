<?php

namespace App\Listeners;

use App\Services\AwardXPService;
use App\Services\StreakService;
use Illuminate\Auth\Events\Login;

class AwardDailyLoginXP
{
    protected AwardXPService $xpService;
    protected StreakService $streakService;

    public function __construct(AwardXPService $xpService, StreakService $streakService)
    {
        $this->xpService = $xpService;
        $this->streakService = $streakService;
    }

    public function handle(Login $event): void
    {
        try {
            $user = $event->user;
            $role = $user->role ?? 'student';

            // Award daily login XP
            $this->xpService->awardXP(
                $user->id,
                $role,
                'daily_login',
                'Daily login',
                'user',
                $user->id
            );

            // Track streak
            $this->streakService->recordLogin($user->id);
        } catch (\Exception $e) {
            \Log::error('Failed to award daily login XP', ['error' => $e->getMessage()]);
        }
    }
}
