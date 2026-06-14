<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TrainerProfileAdminController extends Controller
{
    public function getPendingReviews(Request $request): JsonResponse
    {
        try {
            $trainers = Trainer::where('admin_review_status', 'pending')
                ->where('profile_status', 'submitted')
                ->with(['user', 'experiences', 'certifications'])
                ->orderBy('profile_submitted_at', 'asc')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $trainers->items(),
                'pagination' => [
                    'total' => $trainers->total(),
                    'per_page' => $trainers->perPage(),
                    'current_page' => $trainers->currentPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pending reviews: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function approveProfile(Request $request, $trainerId): JsonResponse
    {
        try {
            $trainer = Trainer::findOrFail($trainerId);

            $trainer->update([
                'admin_review_status' => 'approved',
                'profile_status' => 'active',
                'verified_at' => now(),
                'is_approved' => true,
                'approved_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile approved successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function rejectProfile(Request $request, $trainerId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string|max:500',
            ]);

            $trainer = Trainer::findOrFail($trainerId);

            $trainer->update([
                'admin_review_status' => 'rejected',
                'profile_status' => 'rejected',
                'admin_rejection_reason' => $validated['reason'],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile rejected successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function suspendProfile(Request $request, $trainerId): JsonResponse
    {
        try {
            $validated = $request->validate([
                'reason' => 'required|string|max:500',
            ]);

            $trainer = Trainer::findOrFail($trainerId);

            $trainer->update([
                'admin_review_status' => 'suspended',
                'profile_status' => 'suspended',
                'admin_rejection_reason' => $validated['reason'],
                'is_available_for_booking' => false,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Profile suspended successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to suspend profile: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function listTrainerProfiles(Request $request): JsonResponse
    {
        try {
            $query = Trainer::with(['user', 'packages']);

            if ($request->get('status')) {
                $query->where('profile_status', $request->get('status'));
            }

            if ($request->get('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('full_name', 'like', "%$search%")
                        ->orWhere('professional_title', 'like', "%$search%");
                });
            }

            $trainers = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $trainers->items(),
                'pagination' => [
                    'total' => $trainers->total(),
                    'per_page' => $trainers->perPage(),
                    'current_page' => $trainers->currentPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch trainer profiles: ' . $e->getMessage(),
            ], 500);
        }
    }
}
