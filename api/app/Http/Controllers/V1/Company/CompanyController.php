<?php

namespace App\Http\Controllers\V1\Company;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Services\CompanyService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    protected CompanyService $companyService;

    public function __construct(CompanyService $companyService)
    {
        $this->companyService = $companyService;
    }

    /**
     * Get authenticated company's dashboard
     * GET /companies/me/dashboard
     */
    public function dashboard(): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $dashboard = $this->companyService->getDashboardData($company);

        return response()->json([
            'success' => true,
            'data' => $dashboard,
        ]);
    }

    /**
     * Get company campaigns
     * GET /companies/me/campaigns
     */
    public function campaigns(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $status = $request->query('status');
        $perPage = $request->query('per_page', 10);

        $campaigns = $this->companyService->getCompanyCampaigns($company, $status, $perPage);

        return response()->json([
            'success' => true,
            'data' => $campaigns['items'],
            'meta' => $campaigns['meta'],
        ]);
    }

    /**
     * Create new campaign
     * POST /companies/me/campaigns
     */
    public function createCampaign(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $validated = $request->validate([
            'title' => 'required|string|min:5|max:300',
            'job_role' => 'required|string|max:100',
            'description' => 'required|string|min:20',
            'domain' => 'required|string|max:100',
            'requirements' => 'sometimes|array',
        ]);

        $campaign = $this->companyService->createCampaign($company, $validated);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $campaign->id,
                'title' => $campaign->title,
                'status' => 'draft',
                'created_at' => $campaign->created_at->toIso8601String(),
            ],
        ], 201);
    }

    /**
     * Update campaign
     * PUT /companies/me/campaigns/{id}
     */
    public function updateCampaign(Request $request, int $id): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $campaign = $company->campaigns()->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|min:5|max:300',
            'job_role' => 'sometimes|string|max:100',
            'description' => 'sometimes|string|min:20',
            'domain' => 'sometimes|string|max:100',
            'requirements' => 'sometimes|array',
            'is_active' => 'sometimes|boolean',
        ]);

        $this->companyService->updateCampaign($campaign, $validated);

        return response()->json([
            'success' => true,
            'data' => [
                'message' => 'Campaign updated successfully',
            ],
        ]);
    }

    /**
     * Get candidates for company (all campaigns)
     * GET /companies/me/candidates
     */
    public function candidates(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $filters = $request->only(['skill', 'domain', 'min_xp', 'country_code']);
        $perPage = $request->query('per_page', 20);

        $candidates = $this->companyService->getCompanyCandidates($company, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $candidates['items'],
            'meta' => $candidates['meta'],
        ]);
    }

    /**
     * Get candidates for specific campaign
     * GET /companies/me/campaigns/{id}/candidates
     */
    public function campaignCandidates(Request $request, int $campaignId): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $campaign = $company->campaigns()->findOrFail($campaignId);

        $perPage = $request->query('per_page', 20);

        $candidates = $this->companyService->getCampaignCandidates($campaign, $perPage);

        return response()->json([
            'success' => true,
            'data' => $candidates['items'],
            'meta' => $candidates['meta'],
        ]);
    }

    /**
     * Invite candidate to campaign
     * POST /companies/me/campaigns/{id}/invite
     */
    public function inviteCandidate(Request $request, int $campaignId): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $campaign = $company->campaigns()->findOrFail($campaignId);

        $validated = $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'message' => 'sometimes|string|max:1000',
        ]);

        try {
            $candidate = $this->companyService->inviteCandidate($campaign, $validated);

            return response()->json([
                'success' => true,
                'data' => [
                    'message' => 'Candidate invited successfully',
                    'candidate' => [
                        'student_id' => $candidate->student_id,
                        'full_name' => $candidate->student->full_name,
                        'stage' => $candidate->status,
                    ],
                ],
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 409);
        }
    }

    /**
     * Update candidate status
     * PUT /companies/me/candidates/{id}/status
     */
    public function updateCandidateStatus(Request $request, int $candidateId): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $validated = $request->validate([
            'campaign_id' => 'required|integer',
            'stage' => 'required|in:invited,interviewed,shortlisted,hired,rejected',
            'notes' => 'sometimes|string|max:500',
        ]);

        $candidate = $this->companyService->updateCandidateStatus($company, $candidateId, $validated);

        return response()->json([
            'success' => true,
            'data' => [
                'student_id' => $candidate->student_id,
                'stage' => $candidate->status,
                'message' => 'Candidate status updated',
            ],
        ]);
    }

    /**
     * Get company inbox (conversations)
     * GET /companies/me/inbox
     */
    public function inbox(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $perPage = $request->query('per_page', 20);

        $inbox = $this->companyService->getCompanyInbox($company, $perPage);

        return response()->json([
            'success' => true,
            'data' => $inbox['items'],
            'meta' => $inbox['meta'],
        ]);
    }

    /**
     * Send message in inbox
     * POST /companies/me/inbox
     */
    public function sendMessage(Request $request): JsonResponse
    {
        $company = auth()->user()->company;

        if (!$company) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a company',
            ], 400);
        }

        $validated = $request->validate([
            'student_id' => 'required|integer|exists:students,id',
            'message' => 'required|string|min:1|max:5000',
        ]);

        $messageId = $this->companyService->sendMessage($company, $validated);

        return response()->json([
            'success' => true,
            'data' => [
                'message_id' => $messageId,
                'sent_at' => now()->toIso8601String(),
            ],
        ], 201);
    }
}
