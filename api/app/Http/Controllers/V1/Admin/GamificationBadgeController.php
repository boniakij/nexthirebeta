<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GamificationBadgeController extends Controller
{
    public function index(): JsonResponse
    {
        $badges = Badge::orderBy('sort_order')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'slug' => 'required|string|unique:badges',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'category' => 'required|in:interview,skill,milestone,streak,profile,trainer,leaderboard,special',
            'applies_to' => 'required|in:student,trainer',
            'icon_path' => 'nullable|string',
            'xp_reward' => 'required|integer|min:0',
            'unlock_condition_json' => 'required|array',
            'status' => 'in:active,inactive',
            'sort_order' => 'integer',
        ]);

        $badge = Badge::create($validated);

        return response()->json([
            'success' => true,
            'data' => $badge,
        ], 201);
    }

    public function show(Badge $badge): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $badge,
        ]);
    }

    public function update(Request $request, Badge $badge): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'string|max:255',
            'description' => 'string',
            'category' => 'in:interview,skill,milestone,streak,profile,trainer,leaderboard,special',
            'icon_path' => 'nullable|string',
            'xp_reward' => 'integer|min:0',
            'unlock_condition_json' => 'array',
            'status' => 'in:active,inactive',
            'sort_order' => 'integer',
        ]);

        $badge->update($validated);

        return response()->json([
            'success' => true,
            'data' => $badge,
        ]);
    }

    public function destroy(Badge $badge): JsonResponse
    {
        $badge->delete();

        return response()->json([
            'success' => true,
            'message' => 'Badge deleted',
        ]);
    }

    public function activate(Badge $badge): JsonResponse
    {
        $badge->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'data' => $badge,
        ]);
    }

    public function deactivate(Badge $badge): JsonResponse
    {
        $badge->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'data' => $badge,
        ]);
    }
}
