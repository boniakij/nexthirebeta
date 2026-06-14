<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerAchievement;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerAchievementController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $achievements = $request->user()->trainer()->achievements()->orderBy('sort_order')->get();

            return response()->json([
                'success' => true,
                'data' => $achievements,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch achievements: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:250',
                'type' => 'required|in:Project,Achievement,Award,Publication,Training Program',
                'organization' => 'string|max:200|nullable',
                'role' => 'string|max:150|nullable',
                'achievement_date' => 'date|nullable',
                'description' => 'required|string',
                'result_impact' => 'string|nullable',
                'project_url' => 'url|nullable|max:500',
                'is_public' => 'boolean|nullable',
            ]);

            $achievement = $request->user()->trainer()->achievements()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Achievement added successfully',
                'data' => $achievement,
            ], 201);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add achievement: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $achievement = TrainerAchievement::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'title' => 'string|max:250',
                'type' => 'in:Project,Achievement,Award,Publication,Training Program',
                'organization' => 'string|max:200|nullable',
                'role' => 'string|max:150|nullable',
                'achievement_date' => 'date|nullable',
                'description' => 'string',
                'result_impact' => 'string|nullable',
                'project_url' => 'url|nullable|max:500',
                'is_public' => 'boolean|nullable',
            ]);

            $achievement->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Achievement updated successfully',
                'data' => $achievement,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update achievement: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            TrainerAchievement::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Achievement deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete achievement: ' . $e->getMessage(),
            ], 500);
        }
    }
}
