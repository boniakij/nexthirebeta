<?php

namespace App\Http\Controllers\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\PointsLedger;
use App\Models\UserGamificationStats;
use App\Models\XPLevel;
use Illuminate\Http\JsonResponse;

class XPController extends Controller
{
    public function summary(): JsonResponse
    {
        $user = auth()->user();
        $stats = UserGamificationStats::where('user_id', $user->id)->first();

        if (!$stats) {
            return response()->json(['success' => false, 'message' => 'Stats not found'], 404);
        }

        $nextLevel = XPLevel::where('level_number', $stats->current_level + 1)->first();
        $currentLevel = XPLevel::where('level_number', $stats->current_level)->first();

        return response()->json([
            'success' => true,
            'data' => [
                'user_id' => $user->id,
                'role' => 'student',
                'total_xp' => $stats->total_xp,
                'current_level' => $stats->current_level,
                'current_level_name' => $currentLevel?->level_name,
                'next_level' => $nextLevel?->level_number,
                'next_level_name' => $nextLevel?->level_name,
                'next_level_xp' => $nextLevel?->xp_required,
                'xp_needed' => $nextLevel ? max(0, $nextLevel->xp_required - $stats->total_xp) : 0,
                'progress_percent' => $nextLevel ? min(100, round(($stats->total_xp / $nextLevel->xp_required) * 100)) : 100,
                'badges_earned' => $stats->badges_count,
                'country_rank' => $stats->country_rank,
                'global_rank' => $stats->global_rank,
            ],
        ]);
    }

    public function history(): JsonResponse
    {
        $user = auth()->user();

        $history = PointsLedger::where('user_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(fn ($ledger) => [
                'id' => $ledger->id,
                'event_type' => $ledger->event_type,
                'event_label' => $ledger->event_label,
                'xp_amount' => $ledger->xp_amount,
                'reference_type' => $ledger->reference_type,
                'reference_id' => $ledger->reference_id,
                'created_at' => $ledger->created_at,
            ]);

        return response()->json([
            'success' => true,
            'data' => $history,
        ]);
    }
}
