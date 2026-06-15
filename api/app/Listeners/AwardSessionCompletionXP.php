<?php

namespace App\Listeners;

use App\Events\SessionCompleted;
use App\Services\AwardXPService;
use App\Services\BadgeUnlockService;

class AwardSessionCompletionXP
{
    protected AwardXPService $xpService;
    protected BadgeUnlockService $badgeService;

    public function __construct(AwardXPService $xpService, BadgeUnlockService $badgeService)
    {
        $this->xpService = $xpService;
        $this->badgeService = $badgeService;
    }

    public function handle(SessionCompleted $event): void
    {
        try {
            // Award XP to student
            $this->xpService->awardXP(
                $event->interview->student_id,
                'student',
                'session_complete',
                'Completed interview session',
                'interview',
                $event->interview->id
            );

            // Award XP to trainer
            $this->xpService->awardXP(
                $event->interview->trainer_id,
                'trainer',
                'session_complete',
                'Completed training session',
                'interview',
                $event->interview->id
            );

            // Check badge unlocks
            $this->badgeService->checkAndUnlockBadges($event->interview->student_id, 'student');
            $this->badgeService->checkAndUnlockBadges($event->interview->trainer_id, 'trainer');
        } catch (\Exception $e) {
            \Log::error('Failed to award session XP', [
                'interview_id' => $event->interview->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
