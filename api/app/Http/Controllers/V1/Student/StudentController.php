<?php

namespace App\Http\Controllers\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Services\StudentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    protected StudentService $studentService;

    public function __construct(StudentService $studentService)
    {
        $this->studentService = $studentService;
    }

    /**
     * Get authenticated student's profile
     * GET /students/me
     */
    public function me(): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        return response()->json([
            'success' => true,
            'data' => $this->studentService->formatStudentProfile($student),
        ]);
    }

    /**
     * Update student profile
     * PUT /students/me
     */
    public function update(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $validated = $request->validate([
            'full_name' => 'sometimes|string|min:2|max:200',
            'university' => 'sometimes|nullable|string|max:200',
            'department' => 'sometimes|nullable|string|max:200',
            'graduation_year' => 'sometimes|nullable|integer|min:2020|max:2050',
            'skills' => 'sometimes|array',
            'preferred_job_role' => 'sometimes|nullable|string|max:100',
            'linkedin_url' => 'sometimes|nullable|url',
            'github_url' => 'sometimes|nullable|url',
            'country_code' => 'sometimes|string|size:2',
        ]);

        $updatedStudent = $this->studentService->updateProfile($student, $validated);

        return response()->json([
            'success' => true,
            'data' => $this->studentService->formatStudentProfile($updatedStudent),
            'message' => 'Profile updated successfully',
        ]);
    }

    /**
     * Upload student resume
     * POST /students/me/resume
     */
    public function uploadResume(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $validated = $request->validate([
            'file' => 'required|file|mimes:pdf|max:5120',
        ]);

        $resumePath = $this->studentService->uploadResume($student, $validated['file']);

        return response()->json([
            'success' => true,
            'data' => [
                'resume_path' => $resumePath,
                'message' => 'Resume uploaded successfully',
            ],
        ]);
    }

    /**
     * Get student dashboard
     * GET /students/me/dashboard
     */
    public function dashboard(): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $dashboard = $this->studentService->getDashboardData($student);

        return response()->json([
            'success' => true,
            'data' => $dashboard,
        ]);
    }

    /**
     * Get student sessions
     * GET /students/me/sessions
     */
    public function sessions(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $status = $request->query('status');
        $perPage = $request->query('per_page', 10);
        $cursor = $request->query('cursor');

        $sessions = $this->studentService->getStudentSessions($student, $status, $perPage, $cursor);

        return response()->json([
            'success' => true,
            'data' => $sessions['items'],
            'meta' => $sessions['meta'],
        ]);
    }

    /**
     * Get student evaluations
     * GET /students/me/evaluations
     */
    public function evaluations(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $perPage = $request->query('per_page', 10);
        $cursor = $request->query('cursor');

        $evaluations = $this->studentService->getStudentEvaluations($student, $perPage, $cursor);

        return response()->json([
            'success' => true,
            'data' => $evaluations['items'],
            'meta' => $evaluations['meta'],
        ]);
    }

    /**
     * Get student badges
     * GET /students/me/badges
     */
    public function badges(): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $badges = $this->studentService->getStudentBadges($student);

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    /**
     * Get student XP history
     * GET /students/me/xp-history
     */
    public function xpHistory(Request $request): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $perPage = $request->query('per_page', 20);
        $cursor = $request->query('cursor');

        $history = $this->studentService->getXpHistory($student, $perPage, $cursor);

        return response()->json([
            'success' => true,
            'data' => $history['items'],
            'meta' => $history['meta'],
        ]);
    }

    /**
     * Get public student profile
     * GET /students/{id}/public
     */
    public function publicProfile(int $id): JsonResponse
    {
        $student = Student::findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $this->studentService->formatPublicProfile($student),
        ]);
    }
}
