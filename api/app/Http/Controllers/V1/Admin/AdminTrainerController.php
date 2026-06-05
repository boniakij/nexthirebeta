<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminTrainerController extends Controller
{
    /**
     * GET /api/admin/trainers
     * Get all trainers with filters
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Trainer::with('user');

            // Filter by status
            if ($request->has('status') && $request->status !== 'all') {
                $query->where('approval_status', $request->status);
            }

            // Filter by expertise
            if ($request->has('expertise') && $request->expertise !== 'all') {
                $query->whereJsonContains('expertise', $request->expertise);
            }

            // Search by name or email
            if ($request->has('search')) {
                $search = $request->search;
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('email', 'like', "%{$search}%")
                      ->orWhere('name', 'like', "%{$search}%");
                });
            }

            // Filter by rating
            if ($request->has('min_rating')) {
                $query->where('average_rating', '>=', $request->min_rating);
            }

            // Pagination
            $trainers = $query->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $trainers->items(),
                'pagination' => [
                    'total' => $trainers->total(),
                    'per_page' => $trainers->perPage(),
                    'current_page' => $trainers->currentPage(),
                    'last_page' => $trainers->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch trainers: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/admin/trainers/pending
     * Get pending trainers awaiting approval
     */
    public function getPending(Request $request): JsonResponse
    {
        try {
            $trainers = Trainer::with('user')
                ->where('approval_status', 'pending')
                ->orderBy('created_at', 'desc')
                ->paginate($request->get('per_page', 10));

            return response()->json([
                'success' => true,
                'data' => $trainers->items(),
                'pagination' => [
                    'total' => $trainers->total(),
                    'per_page' => $trainers->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch pending trainers: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/admin/trainers/:id
     * Get trainer details
     */
    public function show(int $id): JsonResponse
    {
        try {
            $trainer = Trainer::with(['user', 'reviews', 'complaints'])
                ->findOrFail($id);

            return response()->json([
                'success' => true,
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Trainer not found: ' . $e->getMessage(),
            ], 404);
        }
    }

    /**
     * POST /api/admin/trainers/:id/approve
     * Approve a trainer
     */
    public function approve(int $id, Request $request): JsonResponse
    {
        try {
            $trainer = Trainer::findOrFail($id);

            DB::beginTransaction();

            // Update trainer approval status
            $trainer->update([
                'approval_status' => 'approved',
                'approved_at' => now(),
                'approved_by' => auth()->id(),
            ]);

            // Log activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($trainer)
                ->log('Trainer approved');

            // Send notification to trainer
            // TODO: Implement notification sending

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trainer approved successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve trainer: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/admin/trainers/:id/reject
     * Reject a trainer application
     */
    public function reject(int $id, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'reason' => 'required|string|min:10|max:500',
            ]);

            $trainer = Trainer::findOrFail($id);

            DB::beginTransaction();

            // Update trainer status
            $trainer->update([
                'approval_status' => 'rejected',
                'rejection_reason' => $request->reason,
                'rejected_at' => now(),
                'rejected_by' => auth()->id(),
            ]);

            // Log activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($trainer)
                ->log('Trainer rejected');

            // Send rejection notification
            // TODO: Implement notification sending

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trainer rejected successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject trainer: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * POST /api/admin/trainers/:id/suspend
     * Suspend a trainer
     */
    public function suspend(int $id, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'reason' => 'required|string|max:500',
            ]);

            $trainer = Trainer::findOrFail($id);

            $trainer->update([
                'status' => 'suspended',
                'suspension_reason' => $request->reason,
                'suspended_at' => now(),
                'suspended_by' => auth()->id(),
            ]);

            // Log activity
            activity()
                ->causedBy(auth()->user())
                ->performedOn($trainer)
                ->log('Trainer suspended');

            return response()->json([
                'success' => true,
                'message' => 'Trainer suspended successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to suspend trainer: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/admin/trainers/:id/reviews
     * Get trainer reviews and ratings
     */
    public function getReviews(int $id, Request $request): JsonResponse
    {
        try {
            $trainer = Trainer::findOrFail($id);

            $reviews = $trainer->reviews()
                ->with('reviewer')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $reviews->items(),
                'pagination' => [
                    'total' => $reviews->total(),
                    'per_page' => $reviews->perPage(),
                ],
                'stats' => [
                    'average_rating' => $trainer->average_rating,
                    'total_reviews' => $trainer->reviews()->count(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch reviews: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * GET /api/admin/trainers/:id/complaints
     * Get trainer complaints
     */
    public function getComplaints(int $id, Request $request): JsonResponse
    {
        try {
            $trainer = Trainer::findOrFail($id);

            $complaints = $trainer->complaints()
                ->with('complainant')
                ->paginate($request->get('per_page', 15));

            return response()->json([
                'success' => true,
                'data' => $complaints->items(),
                'pagination' => [
                    'total' => $complaints->total(),
                    'per_page' => $complaints->perPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch complaints: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * PUT /api/admin/trainers/:id
     * Update trainer information
     */
    public function update(int $id, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'hourly_rate' => 'nullable|numeric|min:0',
                'bio' => 'nullable|string|max:1000',
                'expertise' => 'nullable|array',
            ]);

            $trainer = Trainer::findOrFail($id);

            $trainer->update($request->only(['hourly_rate', 'bio', 'expertise']));

            return response()->json([
                'success' => true,
                'message' => 'Trainer updated successfully',
                'data' => $trainer,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update trainer: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * DELETE /api/admin/trainers/:id
     * Delete trainer
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $trainer = Trainer::findOrFail($id);

            DB::beginTransaction();

            // Log deletion
            activity()
                ->causedBy(auth()->user())
                ->performedOn($trainer)
                ->log('Trainer deleted');

            $trainer->delete();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Trainer deleted successfully',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete trainer: ' . $e->getMessage(),
            ], 500);
        }
    }
}
