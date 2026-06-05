<?php

namespace App\Listeners;

use App\Events\SessionCompleted;
use App\Services\XPService;
use Illuminate\Support\Facades\DB;

class SessionCompletedListener
{
    protected XPService $xpService;

    /**
     * Create the event listener.
     */
    public function __construct(XPService $xpService)
    {
        $this->xpService = $xpService;
    }

    /**
     * Handle the event.
     */
    public function handle(SessionCompleted $event): void
    {
        DB::transaction(function () use ($event) {
            $interview = $event->interview;
            $student = $interview->student;
            $trainer = $interview->trainer;

            // Award XP to student
            $isFirstInterview = $student->interviews()
                ->where('status', 'completed')
                ->count() === 1;

            if ($isFirstInterview) {
                $this->xpService->award($student, 'first_interview');
            } else {
                $this->xpService->award($student, 'interview_completed');
            }

            // Update trainer stats
            $trainer->increment('total_sessions');

            // Update payment status
            $interview->payments()
                ->where('status', 'completed')
                ->update(['status' => 'payout_pending']);

            // Dispatch notifications
            \App\Jobs\SendNotification::dispatch(
                $student->user_id,
                'Interview Completed',
                'Thank you for completing your interview session. Please wait for the trainer evaluation.',
                ['interview_id' => $interview->id]
            );

            \App\Jobs\SendNotification::dispatch(
                $trainer->user_id,
                'Interview Completed',
                'Please evaluate this interview session and provide feedback to the student.',
                ['interview_id' => $interview->id]
            );
        });
    }
}
