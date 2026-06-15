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
                'target_level' => 'required|string',
                'package_type' => 'required|string',
                'short_description' => 'required|string|max:500',
                'description' => 'required|string',
                'tags' => 'nullable|array',
                'duration_minutes' => 'required|integer|min:15',
                'session_mode' => 'required|string',
                'language' => 'required|string',
                'difficulty' => 'required|in:beginner,intermediate,advanced,expert',
                'session_count' => 'required|integer|min:1',
                'includes_cv_review' => 'boolean',
                'includes_written_feedback' => 'boolean',
                'preparation_instructions' => 'nullable|string',
                'price' => 'required|numeric|min:0',
                'discount_price' => 'nullable|numeric|min:0',
                'currency' => 'required|string',
                'required_documents' => 'nullable|array',
                'custom_questions' => 'nullable|array',
                'availability_scope' => 'required|string',
                'status' => 'required|in:draft,pending_review,active,paused,archived',
            ]);

            // Map frontend payload to database columns
            $packageData = [
                'title' => $validated['title'],
                'category' => $validated['category'],
                'interview_type' => $validated['package_type'], // mapped
                'difficulty_level' => $validated['difficulty'], // mapped
                'language' => $validated['language'],
                'short_description' => $validated['short_description'],
                'description' => $validated['description'],
                'number_of_sessions' => $validated['session_count'], // mapped
                'price' => $validated['price'],
                'discount_price' => $validated['discount_price'] ?? null,
                'session_duration' => $validated['duration_minutes'], // mapped
                'package_validity' => 90, // default
                'max_students' => 1, // default for 1:1
                'session_type' => 'one_to_one', // default
                'days_of_week' => [], // default
                'session_time' => '00:00', // default
                'timezone' => 'UTC', // default
                'start_date' => now(), // default
                'includes_cv_review' => $validated['includes_cv_review'] ?? false,
                'includes_career_guideline' => false,
                'includes_mock_interview' => true,
                'status' => $validated['status'],
                
                // New flexible booking fields:
                'target_level' => $validated['target_level'],
                'tags' => $validated['tags'] ?? [],
                'session_mode' => $validated['session_mode'],
                'includes_written_feedback' => $validated['includes_written_feedback'] ?? false,
                'preparation_instructions' => $validated['preparation_instructions'] ?? null,
                'currency' => $validated['currency'],
                'required_documents' => $validated['required_documents'] ?? [],
                'custom_questions' => $validated['custom_questions'] ?? [],
                'availability_scope' => $validated['availability_scope'],
            ];

            $package = $this->service->createPackage(auth()->user()->trainer, $packageData);

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
