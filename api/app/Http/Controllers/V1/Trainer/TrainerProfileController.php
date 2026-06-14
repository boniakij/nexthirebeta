<?php

namespace App\Http\Controllers\V1\Trainer;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use App\Models\TrainerExperience;
use App\Models\TrainerCertification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TrainerProfileController extends Controller
{
    public function getMyProfile(Request $request): JsonResponse
    {
        try {
            $trainer = $request->user()->trainer()->with('experiences', 'certifications')->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Profile not found',
            ], 404);
        }
    }

    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $trainer = $request->user()->trainer();

            $validated = $request->validate([
                'display_name' => 'string|max:150',
                'phone_number' => 'string|max:20',
                'location' => 'string|max:150',
                'time_zone' => 'string|max:50',
                'preferred_language' => 'string|max:50',
                'professional_title' => 'string|max:150',
                'current_company' => 'string|max:150',
                'current_designation' => 'string|max:150',
                'industry' => 'string|max:100',
                'trainer_type' => 'string|max:100',
                'headline' => 'string|max:255',
                'bio' => 'string|min:100',
                'booking_value_statement' => 'string',
                'years_experience' => 'integer|min:0',
                'highest_degree' => 'string|max:100',
                'institution_name' => 'string|max:200',
                'graduation_year' => 'integer|min:1900|max:2100',
                'field_of_study' => 'string|max:100',
                'response_time' => 'string|max:50',
                'cancellation_policy' => 'string',
                'refund_policy' => 'string',
                'target_student_levels' => 'array',
                'preferred_session_modes' => 'array',
                'languages' => 'array',
                'social_links' => 'array',
                'is_available_for_booking' => 'boolean',
                'is_featured' => 'boolean',
                'accepting_new_students' => 'boolean',
            ]);

            $trainer->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $trainer,
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function uploadPhoto(Request $request): JsonResponse
    {
        try {
            // Validate request
            $validated = $request->validate([
                'photo' => 'required|image|max:2048',
            ]);

            // Get authenticated user's trainer profile
            $user = $request->user();
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unauthenticated',
                ], 401);
            }

            $trainer = $user->trainer();
            if (!$trainer) {
                return response()->json([
                    'success' => false,
                    'message' => 'Trainer profile not found',
                ], 404);
            }

            // Delete old photo if exists
            if ($trainer->profile_photo_url && Storage::disk('public')->exists($trainer->profile_photo_url)) {
                Storage::disk('public')->delete($trainer->profile_photo_url);
            }

            // Store new photo
            $file = $request->file('photo');
            if (!$file) {
                return response()->json([
                    'success' => false,
                    'message' => 'No file uploaded',
                ], 400);
            }

            $path = $file->store('trainer-profiles', 'public');
            if (!$path) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to store file',
                ], 500);
            }

            // Update trainer record
            $trainer->update(['profile_photo_url' => $path]);

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Photo uploaded successfully',
                'photo_url' => asset('storage/' . $path),
                'data' => [
                    'profile_photo_url' => $path,
                    'profile_photo' => asset('storage/' . $path),
                ],
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            \Log::error('Photo upload error: ' . $e->getMessage(), [
                'user_id' => $request->user()?->id ?? 'unknown',
                'exception' => $e,
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to upload photo: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function submitForReview(Request $request): JsonResponse
    {
        try {
            $trainer = $request->user()->trainer();

            if (empty($trainer->full_name) || empty($trainer->professional_title) || empty($trainer->bio)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Please complete all required fields before submitting',
                ], 422);
            }

            if (strlen($trainer->bio) < 100) {
                return response()->json([
                    'success' => false,
                    'message' => 'Bio must be at least 100 characters',
                ], 422);
            }

            $trainer->update([
                'profile_status' => 'submitted',
                'admin_review_status' => 'pending',
                'profile_submitted_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile submitted for review',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to submit profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getPublicProfile($trainerId): JsonResponse
    {
        try {
            $trainer = Trainer::where('id', $trainerId)
                ->where('profile_status', 'active')
                ->with(['experiences', 'certifications', 'packages', 'reviews'])
                ->firstOrFail();

            return response()->json([
                'success' => true,
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Trainer profile not found',
            ], 404);
        }
    }

    public function addExperience(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'company_name' => 'required|string|max:200',
                'job_title' => 'required|string|max:150',
                'employment_type' => 'required|in:full_time,part_time,contract,freelance,internship',
                'start_date' => 'required|date',
                'end_date' => 'nullable|date|after:start_date',
                'is_current' => 'boolean',
                'description' => 'string|nullable',
            ]);

            $experience = $request->user()->trainer()->experiences()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Experience added',
                'data' => $experience,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add experience: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateExperience(Request $request, $id): JsonResponse
    {
        try {
            $experience = TrainerExperience::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'company_name' => 'string|max:200',
                'job_title' => 'string|max:150',
                'employment_type' => 'in:full_time,part_time,contract,freelance,internship',
                'start_date' => 'date',
                'end_date' => 'nullable|date',
                'is_current' => 'boolean',
                'description' => 'string|nullable',
            ]);

            $experience->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Experience updated',
                'data' => $experience,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update experience: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteExperience(Request $request, $id): JsonResponse
    {
        try {
            TrainerExperience::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Experience deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete experience: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function addCertification(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'certification_name' => 'required|string|max:200',
                'issuing_organization' => 'required|string|max:200',
                'certificate_url' => 'string|url|nullable',
                'issue_date' => 'required|date',
                'expiry_date' => 'nullable|date|after:issue_date',
            ]);

            $certification = $request->user()->trainer()->certifications()->create($validated);

            return response()->json([
                'success' => true,
                'message' => 'Certification added',
                'data' => $certification,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to add certification: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function updateCertification(Request $request, $id): JsonResponse
    {
        try {
            $certification = TrainerCertification::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id);

            $validated = $request->validate([
                'certification_name' => 'string|max:200',
                'issuing_organization' => 'string|max:200',
                'certificate_url' => 'string|url|nullable',
                'issue_date' => 'date',
                'expiry_date' => 'nullable|date',
            ]);

            $certification->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Certification updated',
                'data' => $certification,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update certification: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function deleteCertification(Request $request, $id): JsonResponse
    {
        try {
            TrainerCertification::where('trainer_id', $request->user()->trainer()->id)
                ->findOrFail($id)
                ->delete();

            return response()->json([
                'success' => true,
                'message' => 'Certification deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete certification: ' . $e->getMessage(),
            ], 500);
        }
    }
}
