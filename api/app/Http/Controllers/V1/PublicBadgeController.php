<?php

namespace App\Http\Controllers\V1;

use App\Http\Controllers\Controller;
use App\Models\Badge;
use Illuminate\Http\JsonResponse;

class PublicBadgeController extends Controller
{
    public function index(): JsonResponse
    {
        $badges = Badge::active()
            ->orderBy('sort_order')
            ->orderBy('category')
            ->get()
            ->groupBy('category');

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    public function byCategory(string $category): JsonResponse
    {
        $badges = Badge::active()
            ->where('category', $category)
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $badges,
        ]);
    }

    public function show(Badge $badge): JsonResponse
    {
        if (!$badge->active()) {
            return response()->json(['success' => false, 'message' => 'Badge not found'], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $badge,
        ]);
    }
}
