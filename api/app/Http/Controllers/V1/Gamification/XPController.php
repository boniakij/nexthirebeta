<?php

namespace App\Http\Controllers\V1\Gamification;

use App\Http\Controllers\Controller;
use App\Services\XPService;
use Illuminate\Http\JsonResponse;

class XPController extends Controller
{
    protected XPService $xpService;

    public function __construct(XPService $xpService)
    {
        $this->xpService = $xpService;
    }

    /**
     * Get XP levels and thresholds
     */
    public function levels(): JsonResponse
    {
        $thresholds = $this->xpService->getXPThresholds();

        $levels = array_map(function ($level, $xp) {
            $nextLevel = $level + 1;
            $nextThreshold = $thresholds[$nextLevel] ?? null;

            return [
                'level' => $level,
                'min_xp' => $xp,
                'max_xp' => $nextThreshold ? $nextThreshold - 1 : null,
                'next_level_xp_required' => $nextThreshold,
            ];
        }, array_keys($thresholds), array_values($thresholds));

        return response()->json([
            'success' => true,
            'data' => $levels,
        ]);
    }

    /**
     * Get authenticated student's XP and level info
     */
    public function myProgress(): JsonResponse
    {
        $student = auth()->user()->student;

        if (!$student) {
            return response()->json([
                'success' => false,
                'message' => 'User is not a student',
            ], 400);
        }

        $thresholds = $this->xpService->getXPThresholds();
        $currentLevelThreshold = $thresholds[$student->current_level];
        $nextLevelThreshold = $thresholds[$student->current_level + 1] ?? null;

        $xpToNextLevel = $nextLevelThreshold ? $nextLevelThreshold - $student->total_xp : null;
        $xpInCurrentLevel = $student->total_xp - $currentLevelThreshold;
        $levelXpRange = $nextLevelThreshold ? $nextLevelThreshold - $currentLevelThreshold : 0;

        return response()->json([
            'success' => true,
            'data' => [
                'total_xp' => $student->total_xp,
                'current_level' => $student->current_level,
                'xp_in_current_level' => $xpInCurrentLevel,
                'xp_to_next_level' => $xpToNextLevel,
                'level_progress_percentage' => $levelXpRange > 0
                    ? round($xpInCurrentLevel / $levelXpRange * 100, 2)
                    : 100,
                'xp_events' => XPService::XP_EVENTS,
            ],
        ]);
    }
}
