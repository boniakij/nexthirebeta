<?php

namespace App\Http\Controllers\V1\Student;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use App\Models\BadgeProgress;
use App\Models\UserBadge;
use Illuminate\Http\JsonResponse;

class BadgeController extends Controller
{
    public function index(): JsonResponse
    {
        $user = auth()->user();

        $badges = Badge::active()
            ->forStudent()
            ->orderBy('sort_order')
            ->get()
            ->map(function ($badge) use ($user) {
                $unlocked = UserBadge::where('user_id', $user->id)
                    ->where('badge_id', $badge->id)
                    ->first();

                $progress = BadgeProgress::where('user_id', $user->id)
                    ->where('badge_id', $badge->id)
                    ->first();

                return [
                    'badge_id' => $badge->id,
                    'slug' => $badge->slug,
                    'name' => $badge->name,
                    'description' => $badge->description,
                    'category' => $badge->category,
                    'icon_url' => $badge->icon_path,
                    'xp_reward' => $badge->xp_reward,
                    'is_unlocked' => !!$unlocked,
                    'unlocked_at' => $unlocked?->unlocked_at,
                    'progress' => $progress ? [
                        'current' => $progress->current_value,
                        'target' => $progress->target_value,
                    ] : null,
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    public function show(Badge $badge): JsonResponse
    {
        $user = auth()->user();

        if ($badge->applies_to !== 'student') {
            return response()->json(['success' => false, 'message' => 'Badge not found'], 404);
        }

        $unlocked = UserBadge::where('user_id', $user->id)
            ->where('badge_id', $badge->id)
            ->first();

        $progress = BadgeProgress::where('user_id', $user->id)
            ->where('badge_id', $badge->id)
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'badge_id' => $badge->id,
                'slug' => $badge->slug,
                'name' => $badge->name,
                'description' => $badge->description,
                'category' => $badge->category,
                'icon_url' => $badge->icon_path,
                'xp_reward' => $badge->xp_reward,
                'is_unlocked' => !!$unlocked,
                'unlocked_at' => $unlocked?->unlocked_at,
                'progress' => $progress ? [
                    'current' => $progress->current_value,
                    'target' => $progress->target_value,
                ] : null,
            ],
        ]);
    }
}
