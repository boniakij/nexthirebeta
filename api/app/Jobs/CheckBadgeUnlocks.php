<?php

namespace App\Jobs;

use App\Models\Student;
use App\Services\BadgeService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class CheckBadgeUnlocks implements ShouldQueue
{
    use Queueable;

    protected Student $student;

    /**
     * Create a new job instance.
     */
    public function __construct(Student $student)
    {
        $this->student = $student;
    }

    /**
     * Execute the job.
     */
    public function handle(BadgeService $badgeService): void
    {
        $badgeService->checkUnlocks($this->student);
    }
}
