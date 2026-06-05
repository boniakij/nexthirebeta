<?php

namespace App\Http\Controllers\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    /**
     * Get global leaderboard
     */
    public function global(Request $request): JsonResponse
    {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 50);

        $leaderboard = Student::orderBy('total_xp', 'desc')
            ->select('id', 'user_id', 'full_name', 'total_xp', 'current_level', 'country_code')
            ->with('user:id,profile_photo')
            ->paginate($perPage, ['*'], 'page', $page);

        $formattedData = $leaderboard->map(function ($student, $index) use ($perPage, $page) {
            $rank = ($page - 1) * $perPage + $index + 1;
            return [
                'rank' => $rank,
                'id' => $student->id,
                'name' => $student->full_name,
                'profile_photo' => $student->user->profile_photo,
                'total_xp' => $student->total_xp,
                'level' => $student->current_level,
                'country_code' => $student->country_code,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $formattedData,
            'meta' => [
                'current_page' => $leaderboard->currentPage(),
                'total' => $leaderboard->total(),
                'per_page' => $leaderboard->perPage(),
                'last_page' => $leaderboard->lastPage(),
            ],
        ]);
    }

    /**
     * Get country leaderboard
     */
    public function country(string $code, Request $request): JsonResponse
    {
        $page = $request->query('page', 1);
        $perPage = $request->query('per_page', 50);

        $leaderboard = Student::where('country_code', strtoupper($code))
            ->orderBy('total_xp', 'desc')
            ->select('id', 'user_id', 'full_name', 'total_xp', 'current_level', 'country_code')
            ->with('user:id,profile_photo')
            ->paginate($perPage, ['*'], 'page', $page);

        $formattedData = $leaderboard->map(function ($student, $index) use ($perPage, $page) {
            $rank = ($page - 1) * $perPage + $index + 1;
            return [
                'rank' => $rank,
                'id' => $student->id,
                'name' => $student->full_name,
                'profile_photo' => $student->user->profile_photo,
                'total_xp' => $student->total_xp,
                'level' => $student->current_level,
                'country_code' => $student->country_code,
            ];
        })->values();

        return response()->json([
            'success' => true,
            'data' => $formattedData,
            'meta' => [
                'current_page' => $leaderboard->currentPage(),
                'total' => $leaderboard->total(),
                'per_page' => $leaderboard->perPage(),
                'last_page' => $leaderboard->lastPage(),
            ],
        ]);
    }

    /**
     * Get authenticated student's rank
     */
    public function myRank(): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        // Global rank
        $globalRank = Student::where('total_xp', '>', $student->total_xp)->count() + 1;

        // Country rank
        $countryRank = Student::where('country_code', $student->country_code)
            ->where('total_xp', '>', $student->total_xp)
            ->count() + 1;

        // Total students
        $totalStudents = Student::count();
        $countryTotal = Student::where('country_code', $student->country_code)->count();

        return response()->json([
            'success' => true,
            'data' => [
                'global' => [
                    'rank' => $globalRank,
                    'total' => $totalStudents,
                    'percentile' => round(($totalStudents - $globalRank) / $totalStudents * 100, 2),
                ],
                'country' => [
                    'rank' => $countryRank,
                    'total' => $countryTotal,
                    'percentile' => round(($countryTotal - $countryRank) / $countryTotal * 100, 2),
                    'country_code' => $student->country_code,
                ],
                'xp' => $student->total_xp,
                'level' => $student->current_level,
            ],
        ]);
    }
}
