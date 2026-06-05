<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use App\Services\TrainerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerController extends Controller
{
    protected TrainerService $trainerService;

    public function __construct(TrainerService $trainerService)
    {
        $this->trainerService = $trainerService;
    }

    /**
     * List trainers with pagination and filtering
     */
    public function index(Request $request): JsonResponse
    {
        $domain = $request->query('domain');
        $minRating = $request->query('min_rating');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 15);

        $trainers = $this->trainerService->getApprovedTrainers(
            $domain,
            $minRating,
            $page,
            $perPage
        );

        return response()->json([
            'success' => true,
            'data' => $trainers->items(),
            'meta' => [
                'current_page' => $trainers->currentPage(),
                'total' => $trainers->total(),
                'per_page' => $trainers->perPage(),
                'last_page' => $trainers->lastPage(),
            ],
        ]);
    }

    /**
     * Show trainer profile
     */
    public function show(int $id): JsonResponse
    {
        $trainer = Trainer::with('user', 'reviews')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->trainerService->formatTrainerProfile($trainer),
        ]);
    }

    /**
     * Get authenticated trainer's profile
     */
    public function me(): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $this->trainerService->formatTrainerProfile($trainer),
        ]);
    }

    /**
     * Update trainer profile
     */
    public function update(Request $request): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:200',
            'bio' => 'sometimes|nullable|string',
            'expertise_domains' => 'sometimes|array',
            'years_experience' => 'sometimes|nullable|integer|min:0',
            'certifications' => 'sometimes|array',
            'company_experience' => 'sometimes|array',
            'hourly_rate' => 'sometimes|nullable|numeric|min:0',
            'country_code' => 'sometimes|string|size:2',
        ]);

        $trainer->update($validated);

        return response()->json([
            'success' => true,
            'data' => $this->trainerService->formatTrainerProfile($trainer),
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Get trainer dashboard statistics
     */
    public function dashboard(): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $stats = $this->trainerService->getDashboardStats($trainer);

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Get trainer earnings breakdown
     */
    public function earnings(Request $request): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $days = $request->query('days', 30);
        $earnings = $this->trainerService->getEarnings($trainer, $days);

        return response()->json([
            'success' => true,
            'data' => $earnings,
        ]);
    }

    /**
     * Get trainer sessions
     */
    public function sessions(Request $request): JsonResponse
    {
        $trainer = auth()->user()->trainer;

        if (!$trainer) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a trainer',
            ], 400);
        }

        $status = $request->query('status');
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 15);

        $sessions = $this->trainerService->getSessions($trainer, $status, $page, $perPage);

        return response()->json([
            'success' => true,
            'data' => $sessions->items(),
            'meta' => [
                'current_page' => $sessions->currentPage(),
                'total' => $sessions->total(),
                'per_page' => $sessions->perPage(),
                'last_page' => $sessions->lastPage(),
            ],
        ]);
    }
}
