<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerSkill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerSkillController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $skills = $request->user()->trainer()->skills()->orderBy('sort_order')->get();

            return response()->json([
                'success' => true,
                'data' => $skills,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch skills: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'skill_name' => 'required|string|max:150',
                'skill_category' => 'string|max:100|nullable',
                'skill_level' => 'required|in:Beginner,Intermediate,Advanced,Expert',
                'years_experience' => 'integer|min:0|nullable',
                'is_featured' => 'boolean|nullable',
            ]);

            $skill = $request->user()->trainer()->skills()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Skill added successfully',
                'data' => $skill,
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
                'message' => 'Failed to add skill: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $skill = TrainerSkill::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'skill_name' => 'string|max:150',
                'skill_category' => 'string|max:100|nullable',
                'skill_level' => 'in:Beginner,Intermediate,Advanced,Expert',
                'years_experience' => 'integer|min:0|nullable',
                'is_featured' => 'boolean|nullable',
            ]);

            $skill->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Skill updated successfully',
                'data' => $skill,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update skill: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            TrainerSkill::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Skill deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete skill: ' . $e->getMessage(),
            ], 500);
        }
    }
}
