<?php

namespace App\Services;

use App\Models\Student;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\PointsLedger;
use App\Models\Interview;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\UploadedFile;
use Carbon\Carbon;

class StudentService
{
    /**
     * Format student profile for API response
     */
    public function formatStudentProfile(Student $student): array
    {
        return [
            'id' => $student->id,
            'user_id' => $student->user_id,
            'full_name' => $student->full_name,
            'university' => $student->university,
            'department' => $student->department,
            'graduation_year' => $student->graduation_year,
            'skills' => $student->skills ?? [],
            'preferred_job_role' => $student->preferred_job_role,
            'linkedin_url' => $student->linkedin_url,
            'github_url' => $student->github_url,
            'resume_path' => $student->resume_path,
            'profile_completion' => $student->profile_completion,
            'total_xp' => $student->total_xp,
            'current_level' => $student->current_level,
            'streak_days' => $student->streak_days,
            'country_code' => $student->country_code,
            'last_active_at' => $student->last_active_at?->toIso8601String(),
            'user' => [
                'id' => $student->user->id,
                'email' => $student->user->email,
                'profile_photo' => $student->user->profile_photo,
            ],
        ];
    }

    /**
     * Format public student profile
     */
    public function formatPublicProfile(Student $student): array
    {
        $badges = $student->badges()
            ->with('badge')
            ->where('unlocked_at', '!=', null)
            ->get();

        return [
            'student_id' => $student->id,
            'full_name' => $student->full_name,
            'profile_photo' => $student->user->profile_photo,
            'country_code' => $student->country_code,
            'total_xp' => $student->total_xp,
            'current_level' => $student->current_level,
            'level_name' => $this->getLevelName($student->current_level),
            'global_rank' => $this->getGlobalRank($student),
            'country_rank' => $this->getCountryRank($student),
            'completed_sessions' => $student->interviews()->where('status', 'completed')->count(),
            'skills' => $student->skills ?? [],
            'preferred_job_role' => $student->preferred_job_role,
            'badges' => $badges->map(function ($userBadge) {
                return [
                    'slug' => $userBadge->badge->slug,
                    'name' => $userBadge->badge->name,
                    'icon_path' => $userBadge->badge->icon_path,
                    'unlocked_at' => $userBadge->unlocked_at->toIso8601String(),
                ];
            })->toArray(),
        ];
    }

    /**
     * Update student profile
     */
    public function updateProfile(Student $student, array $data): Student
    {
        $student->update($data);
        $student->refresh();

        return $student;
    }

    /**
     * Upload student resume
     */
    public function uploadResume(Student $student, UploadedFile $file): string
    {
        $filename = 'resume_' . $student->id . '_' . time() . '.pdf';
        $path = Storage::disk('public')->putFileAs('resumes', $file, $filename);

        $student->update(['resume_path' => Storage::url($path)]);

        return Storage::url($path);
    }

    /**
     * Get student dashboard data
     */
    public function getDashboardData(Student $student): array
    {
        $upcomingSessions = $student->interviews()
            ->where('status', 'scheduled')
            ->with('trainer', 'package', 'payment')
            ->orderBy('scheduled_at', 'asc')
            ->limit(5)
            ->get();

        $recentEvaluations = $student->evaluations()
            ->with('interview.trainer', 'interview.package')
            ->orderBy('created_at', 'desc')
            ->limit(3)
            ->get();

        $earnedBadges = $student->badges()
            ->with('badge')
            ->where('unlocked_at', '!=', null)
            ->orderBy('unlocked_at', 'desc')
            ->limit(5)
            ->get();

        return [
            'stats' => [
                'total_xp' => $student->total_xp,
                'current_level' => $student->current_level,
                'level_name' => $this->getLevelName($student->current_level),
                'next_level_xp' => $this->getNextLevelXp($student->current_level),
                'xp_to_next_level' => $this->getXpToNextLevel($student),
                'streak_days' => $student->streak_days,
                'profile_completion' => $student->profile_completion,
                'upcoming_sessions' => $student->interviews()->where('status', 'scheduled')->count(),
                'completed_sessions' => $student->interviews()->where('status', 'completed')->count(),
                'global_rank' => $this->getGlobalRank($student),
                'country_rank' => $this->getCountryRank($student),
            ],
            'upcoming_sessions' => $upcomingSessions->map(function ($interview) {
                return [
                    'id' => $interview->id,
                    'scheduled_at' => $interview->scheduled_at->toIso8601String(),
                    'duration_minutes' => $interview->duration_minutes,
                    'status' => $interview->status,
                    'trainer' => [
                        'full_name' => $interview->trainer->full_name,
                        'profile_photo' => $interview->trainer->user->profile_photo,
                    ],
                    'package' => [
                        'title' => $interview->package->title,
                        'domain' => $interview->package->domain,
                        'interview_type' => $interview->package->interview_type,
                    ],
                ];
            })->toArray(),
            'recent_evaluations' => $recentEvaluations->map(function ($evaluation) {
                return [
                    'id' => $evaluation->id,
                    'created_at' => $evaluation->created_at->toIso8601String(),
                    'overall_level' => $evaluation->overall_level,
                    'communication_score' => $evaluation->communication_score,
                    'technical_score' => $evaluation->technical_score,
                    'confidence_score' => $evaluation->confidence_score,
                    'problem_solving_score' => $evaluation->problem_solving_score,
                    'english_score' => $evaluation->english_score,
                    'hr_readiness_score' => $evaluation->hr_readiness_score,
                    'trainer' => [
                        'full_name' => $evaluation->interview->trainer->full_name,
                    ],
                ];
            })->toArray(),
            'recent_badges' => $earnedBadges->map(function ($userBadge) {
                return [
                    'id' => $userBadge->badge->id,
                    'slug' => $userBadge->badge->slug,
                    'name' => $userBadge->badge->name,
                    'icon_path' => $userBadge->badge->icon_path,
                    'unlocked_at' => $userBadge->unlocked_at->toIso8601String(),
                ];
            })->toArray(),
            'recommended_trainers' => $this->getRecommendedTrainers($student),
        ];
    }

    /**
     * Get student sessions with pagination
     */
    public function getStudentSessions(Student $student, ?string $status, int $perPage, ?string $cursor): array
    {
        $query = $student->interviews()
            ->with('trainer.user', 'package', 'payments', 'evaluation');

        if ($status) {
            $query->where('status', $status);
        }

        $sessions = $query->orderBy('scheduled_at', 'desc')->paginate($perPage);

        $formattedSessions = $sessions->map(function ($interview) {
            $lastPayment = $interview->payments->last();

            return [
                'id' => $interview->id,
                'scheduled_at' => $interview->scheduled_at->toIso8601String(),
                'duration_minutes' => $interview->duration_minutes,
                'status' => $interview->status,
                'xp_awarded' => $interview->xp_awarded,
                'meeting_link' => $interview->meeting_link,
                'trainer' => [
                    'id' => $interview->trainer->id,
                    'full_name' => $interview->trainer->full_name,
                    'profile_photo' => $interview->trainer->user->profile_photo,
                    'average_rating' => $interview->trainer->average_rating,
                ],
                'package' => [
                    'title' => $interview->package->title,
                    'domain' => $interview->package->domain,
                    'interview_type' => $interview->package->interview_type,
                    'duration_minutes' => $interview->package->duration_minutes,
                ],
                'payment' => $lastPayment ? [
                    'amount' => $lastPayment->amount,
                    'currency' => $lastPayment->currency,
                    'status' => $lastPayment->status,
                ] : null,
                'evaluation' => $interview->evaluation ? [
                    'id' => $interview->evaluation->id,
                    'overall_level' => $interview->evaluation->overall_level,
                    'communication_score' => $interview->evaluation->communication_score,
                    'technical_score' => $interview->evaluation->technical_score,
                    'confidence_score' => $interview->evaluation->confidence_score,
                    'problem_solving_score' => $interview->evaluation->problem_solving_score,
                    'english_score' => $interview->evaluation->english_score,
                    'hr_readiness_score' => $interview->evaluation->hr_readiness_score,
                ] : null,
            ];
        })->toArray();

        return [
            'items' => $formattedSessions,
            'meta' => [
                'per_page' => $sessions->perPage(),
                'total' => $sessions->total(),
                'next_cursor' => $sessions->hasMorePages() ? base64_encode(json_encode(['id' => $sessions->lastItem()->id])) : null,
            ],
        ];
    }

    /**
     * Get student evaluations with pagination
     */
    public function getStudentEvaluations(Student $student, int $perPage, ?string $cursor): array
    {
        $evaluations = $student->evaluations()
            ->with('interview.trainer.user', 'interview.package')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return [
            'items' => $evaluations->items(),
            'meta' => [
                'per_page' => $evaluations->perPage(),
                'total' => $evaluations->total(),
                'next_cursor' => $evaluations->hasMorePages() ? base64_encode(json_encode(['id' => $evaluations->lastItem()->id])) : null,
            ],
        ];
    }

    /**
     * Get student badges (earned and locked)
     */
    public function getStudentBadges(Student $student): array
    {
        $allBadges = Badge::all();

        $earned = $student->badges()
            ->with('badge')
            ->where('unlocked_at', '!=', null)
            ->get()
            ->keyBy('badge_id');

        $locked = [];
        $earnedIds = [];

        foreach ($allBadges as $badge) {
            if ($earned->has($badge->id)) {
                $earnedIds[] = $badge->id;
            } else {
                $progress = $this->getBadgeProgress($student, $badge);
                $locked[] = [
                    'id' => $badge->id,
                    'slug' => $badge->slug,
                    'name' => $badge->name,
                    'description' => $badge->description,
                    'icon_path' => $badge->icon_path,
                    'xp_reward' => $badge->xp_reward,
                    'category' => $badge->category,
                    'progress' => $progress,
                ];
            }
        }

        return [
            'earned' => $earned->map(function ($userBadge) {
                return [
                    'id' => $userBadge->badge->id,
                    'slug' => $userBadge->badge->slug,
                    'name' => $userBadge->badge->name,
                    'description' => $userBadge->badge->description,
                    'icon_path' => $userBadge->badge->icon_path,
                    'xp_reward' => $userBadge->badge->xp_reward,
                    'category' => $userBadge->badge->category,
                    'unlocked_at' => $userBadge->unlocked_at->toIso8601String(),
                ];
            })->values()->toArray(),
            'locked' => $locked,
            'total_earned' => count($earnedIds),
            'total_badges' => count($allBadges),
        ];
    }

    /**
     * Get XP history with pagination
     */
    public function getXpHistory(Student $student, int $perPage, ?string $cursor): array
    {
        $history = $student->pointsLedger()
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        return [
            'items' => $history->map(function ($ledger) {
                return [
                    'id' => $ledger->id,
                    'xp_amount' => $ledger->xp_amount,
                    'event_type' => $ledger->event_type,
                    'description' => $ledger->description,
                    'reference_id' => $ledger->reference_id,
                    'created_at' => $ledger->created_at->toIso8601String(),
                ];
            })->toArray(),
            'meta' => [
                'per_page' => $history->perPage(),
                'total' => $history->total(),
                'total_xp' => $student->total_xp,
                'next_cursor' => $history->hasMorePages() ? base64_encode(json_encode(['id' => $history->lastItem()->id])) : null,
            ],
        ];
    }

    /**
     * Get recommended trainers for student
     */
    protected function getRecommendedTrainers(Student $student): array
    {
        // Get trainers with highest ratings and relevant expertise
        $trainers = \App\Models\Trainer::where('is_approved', true)
            ->orderBy('average_rating', 'desc')
            ->with('user')
            ->limit(3)
            ->get();

        return $trainers->map(function ($trainer) {
            return [
                'id' => $trainer->id,
                'full_name' => $trainer->full_name,
                'average_rating' => $trainer->average_rating,
                'expertise_domains' => $trainer->expertise_domains,
                'profile_photo' => $trainer->user->profile_photo,
                'min_package_price' => $trainer->packages()
                    ->where('is_active', true)
                    ->min('price'),
            ];
        })->toArray();
    }

    /**
     * Get badge progress
     */
    protected function getBadgeProgress(Student $student, Badge $badge): ?array
    {
        // This is a placeholder - implement based on your badge logic
        return [
            'current' => 0,
            'required' => 5,
            'label' => '0/5 sessions completed',
        ];
    }

    /**
     * Get level name from level number
     */
    protected function getLevelName(int $level): string
    {
        $levelNames = [
            1 => 'Newcomer',
            2 => 'Explorer',
            3 => 'Learner',
            4 => 'Challenger',
            5 => 'Achiever',
            6 => 'Professional',
            7 => 'Expert',
            8 => 'Elite',
            9 => 'Master',
            10 => 'Industry Ready',
        ];

        return $levelNames[$level] ?? 'Newcomer';
    }

    /**
     * Get XP required for next level
     */
    protected function getNextLevelXp(int $level): int
    {
        $xpRequirements = [
            1 => 0,
            2 => 200,
            3 => 500,
            4 => 1000,
            5 => 2000,
            6 => 3500,
            7 => 5500,
            8 => 8000,
            9 => 11500,
            10 => 15000,
        ];

        return $xpRequirements[$level + 1] ?? 15000;
    }

    /**
     * Get XP to next level
     */
    protected function getXpToNextLevel(Student $student): int
    {
        $nextLevelXp = $this->getNextLevelXp($student->current_level);
        $remaining = $nextLevelXp - $student->total_xp;

        return max(0, $remaining);
    }

    /**
     * Get global rank
     */
    protected function getGlobalRank(Student $student): int
    {
        return Student::where('total_xp', '>', $student->total_xp)
            ->count() + 1;
    }

    /**
     * Get country rank
     */
    protected function getCountryRank(Student $student): int
    {
        return Student::where('country_code', $student->country_code)
            ->where('total_xp', '>', $student->total_xp)
            ->count() + 1;
    }

    /**
     * Get student settings
     */
    public function getSettings(Student $student): array
    {
        return [
            'notification_settings' => $student->notification_settings ?? [
                'email_notifications' => true,
                'session_reminders' => true,
                'interview_updates' => true,
                'badges_unlocked' => true,
                'marketing_emails' => false,
            ],
            'privacy_settings' => $student->privacy_settings ?? [
                'profile_visibility' => 'public',
                'show_xp' => true,
                'show_badges' => true,
                'show_activity' => true,
            ],
        ];
    }

    /**
     * Update student settings
     */
    public function updateSettings(Student $student, $user, array $data): array
    {
        try {
            // Update notification settings
            if (isset($data['notification_settings'])) {
                $student->notification_settings = array_merge(
                    $student->notification_settings ?? [],
                    $data['notification_settings']
                );
            }

            // Update privacy settings
            if (isset($data['privacy_settings'])) {
                $student->privacy_settings = array_merge(
                    $student->privacy_settings ?? [],
                    $data['privacy_settings']
                );
            }

            // Update phone if provided
            if (isset($data['phone'])) {
                $user->phone = $data['phone'];
                $user->save();
            }

            // Update password if provided
            if (isset($data['new_password']) && isset($data['current_password'])) {
                if (!\Hash::check($data['current_password'], $user->password)) {
                    return [
                        'success' => false,
                        'message' => 'Current password is incorrect',
                        'status_code' => 400,
                    ];
                }

                $user->password = \Hash::make($data['new_password']);
                $user->save();
            }

            $student->save();

            return [
                'success' => true,
                'message' => 'Settings updated successfully',
                'data' => $this->getSettings($student),
                'status_code' => 200,
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Failed to update settings: ' . $e->getMessage(),
                'status_code' => 500,
            ];
        }
    }
}
