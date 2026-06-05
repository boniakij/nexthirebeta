<?php

namespace App\Services;

use App\Models\Company;
use App\Models\HiringCampaign;
use App\Models\CampaignCandidate;
use App\Models\Chat;
use App\Models\Student;

class CompanyService
{
    /**
     * Get company dashboard data
     */
    public function getDashboardData(Company $company): array
    {
        $activeCampaigns = $company->campaigns()->where('is_active', true)->count();
        $totalCandidates = $company->campaigns()
            ->join('campaign_candidates', 'hiring_campaigns.id', '=', 'campaign_candidates.campaign_id')
            ->count();

        $activeCampaignsList = $company->campaigns()
            ->where('is_active', true)
            ->with('candidates')
            ->get()
            ->map(function ($campaign) {
                return [
                    'id' => $campaign->id,
                    'title' => $campaign->title,
                    'job_role' => $campaign->position,
                    'candidates_count' => $campaign->candidates->count(),
                    'status' => 'active',
                ];
            })
            ->take(5)
            ->toArray();

        $recentCandidates = CampaignCandidate::whereIn(
            'campaign_id',
            $company->campaigns()->pluck('id')
        )
            ->with('student')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($candidate) {
                return [
                    'student_id' => $candidate->student_id,
                    'full_name' => $candidate->student->full_name,
                    'stage' => $candidate->status,
                    'xp' => $candidate->student->total_xp,
                    'level' => $candidate->student->current_level,
                    'skills' => $candidate->student->skills ?? [],
                ];
            })
            ->toArray();

        return [
            'kyc_status' => 'verified', // TODO: Get actual KYC status
            'is_verified' => true,
            'stats' => [
                'active_campaigns' => $activeCampaigns,
                'total_candidates' => $totalCandidates,
                'interviews_conducted' => 0, // TODO: Count from interviews table
                'hire_rate' => 0, // TODO: Calculate hire rate
            ],
            'active_campaigns' => $activeCampaignsList,
            'recent_candidates' => $recentCandidates,
        ];
    }

    /**
     * Get company campaigns
     */
    public function getCompanyCampaigns(Company $company, ?string $status, int $perPage): array
    {
        $query = $company->campaigns();

        if ($status) {
            if ($status === 'active') {
                $query->where('is_active', true);
            } elseif ($status === 'draft') {
                $query->where('is_active', false);
            }
        }

        $campaigns = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $formattedCampaigns = $campaigns->map(function ($campaign) {
            return [
                'id' => $campaign->id,
                'title' => $campaign->title,
                'job_role' => $campaign->position,
                'description' => $campaign->description,
                'domain' => $campaign->requirements ? (is_array($campaign->requirements) ? $campaign->requirements[0] ?? 'General' : 'General') : 'General',
                'status' => $campaign->is_active ? 'active' : 'draft',
                'candidates_count' => $campaign->candidates()->count(),
                'created_at' => $campaign->created_at->toIso8601String(),
            ];
        })->toArray();

        return [
            'items' => $formattedCampaigns,
            'meta' => [
                'per_page' => $campaigns->perPage(),
                'total' => $campaigns->total(),
                'next_cursor' => $campaigns->hasMorePages() ? base64_encode(json_encode(['id' => $campaigns->lastItem()->id])) : null,
            ],
        ];
    }

    /**
     * Create new campaign
     */
    public function createCampaign(Company $company, array $data): HiringCampaign
    {
        return $company->campaigns()->create([
            'title' => $data['title'],
            'position' => $data['job_role'],
            'description' => $data['description'],
            'requirements' => $data['requirements'] ?? [],
            'is_active' => false, // Draft by default
        ]);
    }

    /**
     * Update campaign
     */
    public function updateCampaign(HiringCampaign $campaign, array $data): void
    {
        $updateData = [];

        if (isset($data['title'])) {
            $updateData['title'] = $data['title'];
        }
        if (isset($data['job_role'])) {
            $updateData['position'] = $data['job_role'];
        }
        if (isset($data['description'])) {
            $updateData['description'] = $data['description'];
        }
        if (isset($data['requirements'])) {
            $updateData['requirements'] = $data['requirements'];
        }
        if (isset($data['is_active'])) {
            $updateData['is_active'] = $data['is_active'];
        }

        $campaign->update($updateData);
    }

    /**
     * Get all candidates for company (across all campaigns)
     */
    public function getCompanyCandidates(Company $company, array $filters, int $perPage): array
    {
        $query = CampaignCandidate::whereIn(
            'campaign_id',
            $company->campaigns()->pluck('id')
        )->with('student');

        if (!empty($filters['skill'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->whereJsonContains('skills', $filters['skill']);
            });
        }

        if (!empty($filters['min_xp'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('total_xp', '>=', $filters['min_xp']);
            });
        }

        if (!empty($filters['country_code'])) {
            $query->whereHas('student', function ($q) use ($filters) {
                $q->where('country_code', $filters['country_code']);
            });
        }

        $candidates = $query->orderBy('created_at', 'desc')->paginate($perPage);

        $formattedCandidates = $candidates->map(function ($candidate) {
            return [
                'student_id' => $candidate->student_id,
                'full_name' => $candidate->student->full_name,
                'profile_photo' => $candidate->student->user->profile_photo,
                'skills' => $candidate->student->skills ?? [],
                'preferred_job_role' => $candidate->student->preferred_job_role,
                'total_xp' => $candidate->student->total_xp,
                'current_level' => $candidate->student->current_level,
                'level_name' => $this->getLevelName($candidate->student->current_level),
                'completed_sessions' => $candidate->student->interviews()->where('status', 'completed')->count(),
                'average_score' => 7.5, // TODO: Calculate from evaluations
                'country_code' => $candidate->student->country_code,
                'badges_count' => $candidate->student->badges()->where('unlocked_at', '!=', null)->count(),
            ];
        })->toArray();

        return [
            'items' => $formattedCandidates,
            'meta' => [
                'per_page' => $candidates->perPage(),
                'total' => $candidates->total(),
                'next_cursor' => $candidates->hasMorePages() ? base64_encode(json_encode(['id' => $candidates->lastItem()->id])) : null,
            ],
        ];
    }

    /**
     * Get candidates for specific campaign
     */
    public function getCampaignCandidates(HiringCampaign $campaign, int $perPage): array
    {
        $candidates = $campaign->candidates()
            ->with('student')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $formattedCandidates = $candidates->map(function ($candidate) {
            return [
                'student_id' => $candidate->student_id,
                'full_name' => $candidate->student->full_name,
                'profile_photo' => $candidate->student->user->profile_photo,
                'skills' => $candidate->student->skills ?? [],
                'preferred_job_role' => $candidate->student->preferred_job_role,
                'total_xp' => $candidate->student->total_xp,
                'current_level' => $candidate->student->current_level,
                'level_name' => $this->getLevelName($candidate->student->current_level),
                'completed_sessions' => $candidate->student->interviews()->where('status', 'completed')->count(),
                'average_score' => 7.5, // TODO: Calculate from evaluations
                'country_code' => $candidate->student->country_code,
                'badges_count' => $candidate->student->badges()->where('unlocked_at', '!=', null)->count(),
                'status' => $candidate->status,
            ];
        })->toArray();

        return [
            'items' => $formattedCandidates,
            'meta' => [
                'per_page' => $candidates->perPage(),
                'total' => $candidates->total(),
                'next_cursor' => $candidates->hasMorePages() ? base64_encode(json_encode(['id' => $candidates->lastItem()->id])) : null,
            ],
        ];
    }

    /**
     * Invite candidate to campaign
     */
    public function inviteCandidate(HiringCampaign $campaign, array $data): CampaignCandidate
    {
        // Check if already invited
        $existing = $campaign->candidates()
            ->where('student_id', $data['student_id'])
            ->first();

        if ($existing) {
            throw new \Exception('This candidate has already been invited to this campaign.');
        }

        $candidate = $campaign->candidates()->create([
            'student_id' => $data['student_id'],
            'status' => 'invited',
            'applied_at' => now(),
        ]);

        // Send message if provided
        if (!empty($data['message'])) {
            $student = Student::find($data['student_id']);
            Chat::create([
                'sender_id' => auth()->id(),
                'recipient_id' => $student->user_id,
                'message' => $data['message'],
            ]);
        }

        return $candidate;
    }

    /**
     * Update candidate status
     */
    public function updateCandidateStatus(Company $company, int $candidateId, array $data): CampaignCandidate
    {
        $candidate = CampaignCandidate::whereIn(
            'campaign_id',
            $company->campaigns()->pluck('id')
        )->findOrFail($candidateId);

        $candidate->update([
            'status' => $data['stage'],
        ]);

        return $candidate;
    }

    /**
     * Get company inbox (conversations with candidates)
     */
    public function getCompanyInbox(Company $company, int $perPage): array
    {
        // Get all unique student IDs that company has chatted with
        $chats = Chat::where('sender_id', auth()->id())
            ->orWhere('recipient_id', auth()->id())
            ->with('sender', 'recipient')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);

        $conversations = [];
        $conversationIds = [];

        foreach ($chats as $chat) {
            $otherUserId = $chat->sender_id === auth()->id() ? $chat->recipient_id : $chat->sender_id;

            if (in_array($otherUserId, $conversationIds)) {
                continue;
            }

            $conversationIds[] = $otherUserId;

            $student = Student::where('user_id', $otherUserId)->first();

            if ($student) {
                $conversations[] = [
                    'id' => $chat->id,
                    'student' => [
                        'id' => $student->id,
                        'full_name' => $student->full_name,
                        'profile_photo' => $student->user->profile_photo,
                    ],
                    'last_message' => [
                        'body' => $chat->message,
                        'sent_at' => $chat->created_at->toIso8601String(),
                        'is_from_company' => $chat->sender_id === auth()->id(),
                    ],
                    'unread_count' => Chat::where('sender_id', $otherUserId)
                        ->where('recipient_id', auth()->id())
                        ->whereNull('read_at')
                        ->count(),
                ];
            }
        }

        return [
            'items' => $conversations,
            'meta' => [
                'per_page' => $perPage,
                'total' => count($conversations),
            ],
        ];
    }

    /**
     * Send message
     */
    public function sendMessage(Company $company, array $data): int
    {
        $student = Student::findOrFail($data['student_id']);

        $message = Chat::create([
            'sender_id' => auth()->id(),
            'recipient_id' => $student->user_id,
            'message' => $data['message'],
        ]);

        return $message->id;
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
}
