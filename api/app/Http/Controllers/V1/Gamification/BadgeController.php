<?php

namespace App\Http\Controllers\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\Student;
use Illuminate\Http\JsonResponse;

class BadgeController extends Controller
{
    /**
     * Get all badges available in the system
     */
    public function index(): JsonResponse
    {
        $badges = Badge::all(['id', 'slug', 'name', 'description', 'icon_path', 'xp_reward', 'category']);

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    /**
     * Get badges earned by authenticated student
     */
    public function myBadges(): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $badges = $student->badges()
            ->with('badge')
            ->get()
            ->map(function ($userBadge) {
                return [
                    'id' => $userBadge->badge->id,
                    'slug' => $userBadge->badge->slug,
                    'name' => $userBadge->badge->name,
                    'description' => $userBadge->badge->description,
                    'icon_path' => $userBadge->badge->icon_path,
                    'xp_reward' => $userBadge->badge->xp_reward,
                    'category' => $userBadge->badge->category,
                    'unlocked_at' => $userBadge->unlocked_at,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }
}
