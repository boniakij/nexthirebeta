<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\InterviewPackage;
use App\Services\InterviewPackageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InterviewPackageController extends Controller
{
    public function __construct(protected InterviewPackageService $service) {}

    public function create(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'category' => 'required|string',
                'interview_type' => 'required|string',
                'difficulty_level' => 'required|in:beginner,intermediate,advanced,expert',
                'language' => 'required|string',
                'short_description' => 'required|string|max:500',
                'description' => 'required|string',
                'number_of_sessions' => 'required|integer|min:1',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'session_duration' => 'required|integer|min:15',
                'package_validity' => 'required|integer|min:7',
                'max_students' => 'required|integer|min:1',
                'session_type' => 'required|in:one_to_one,group',
                'days_of_week' => 'required|array',
                'session_time' => 'required|string',
                'timezone' => 'required|string',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'repeat_weekly' => 'boolean',
                'includes_cv_review' => 'boolean',
                'includes_career_guideline' => 'boolean',
                'includes_mock_interview' => 'boolean',
            ]);

            $package = $this->service->createPackage(auth()->user()->trainer, $validated);

            return response()->json([
                'success' => true,
                'message' => 'Interview package created successfully',
                'data' => $package,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create package: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $trainer = auth()->user()->trainer;
            $packages = InterviewPackage::where('trainer_id', $trainer->id)
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $packages->items(),
                'pagination' => [
                    'total' => $packages->total(),
                    'per_page' => $packages->perPage(),
                    'current_page' => $packages->currentPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch packages: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(int $id): JsonResponse
    {
        try {
            $package = InterviewPackage::findOrFail($id);
            
            if ($package->trainer_id !== auth()->user()->trainer->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            return response()->json([
                'success' => true,
                'data' => $package,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Package not found',
            ], 404);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $package = InterviewPackage::findOrFail($id);
            
            if ($package->trainer_id !== auth()->user()->trainer->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $validated = $request->validate([
                'title' => 'string|max:255',
                'description' => 'string',
                'price' => 'numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'status' => 'in:active,paused,archived',
            ]);

            $package->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Package updated successfully',
                'data' => $package,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update package: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function delete(int $id): JsonResponse
    {
        try {
            $package = InterviewPackage::findOrFail($id);
            
            if ($package->trainer_id !== auth()->user()->trainer->id) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthorized',
                ], 403);
            }

            $package->delete();

            return response()->json([
                'success' => true,
                'message' => 'Package deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete package: ' . $e->getMessage(),
            ], 500);
        }
    }
}
