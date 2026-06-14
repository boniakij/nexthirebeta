<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\TrainerEducation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerEducationController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $educations = $request->user()->trainer()->educations()->orderBy('sort_order')->get();

            return response()->json([
                'success' => true,
                'data' => $educations,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch educations: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'degree' => 'required|string|max:150',
                'institution_name' => 'required|string|max:200',
                'field_of_study' => 'string|max:150|nullable',
                'start_year' => 'integer|min:1900|max:2100|nullable',
                'graduation_year' => 'required|integer|min:1900|max:2100',
                'grade' => 'string|max:10|nullable',
                'description' => 'string|nullable',
            ]);

            $education = $request->user()->trainer()->educations()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Education added successfully',
                'data' => $education,
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
                'message' => 'Failed to add education: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {
            $education = TrainerEducation::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'degree' => 'string|max:150',
                'institution_name' => 'string|max:200',
                'field_of_study' => 'string|max:150|nullable',
                'start_year' => 'integer|min:1900|max:2100|nullable',
                'graduation_year' => 'integer|min:1900|max:2100',
                'grade' => 'string|max:10|nullable',
                'description' => 'string|nullable',
            ]);

            $education->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Education updated successfully',
                'data' => $education,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update education: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function destroy(Request $request, $id): JsonResponse
    {
        try {
            TrainerEducation::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Education deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete education: ' . $e->getMessage(),
            ], 500);
        }
    }
}
