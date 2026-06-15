<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\XPRule;
use App\Models\XPLevel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GamificationXPController extends Controller
{
    public function listRules(): JsonResponse
    {
        $rules = XPRule::orderBy('rule_name')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $rules,
        ]);
    }

    public function createRule(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rule_name' => 'required|string|max:255',
            'applies_to' => 'required|in:student,trainer',
            'event_type' => 'required|string|unique:xp_rules',
            'xp_amount' => 'required|integer|min:1',
            'frequency_limit' => 'in:once_per_event,once_per_day,unlimited',
            'max_award_per_day' => 'nullable|integer|min:1',
            'status' => 'in:active,inactive',
        ]);

        $rule = XPRule::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $rule,
        ], 201);
    }

    public function updateRule(Request $request, XPRule $rule): JsonResponse
    {
        $validated = $request->validate([
            'rule_name' => 'string|max:255',
            'xp_amount' => 'integer|min:1',
            'frequency_limit' => 'in:once_per_event,once_per_day,unlimited',
            'max_award_per_day' => 'nullable|integer|min:1',
            'status' => 'in:active,inactive',
        ]);

        $rule->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'data' => $rule,
        ]);
    }

    public function deleteRule(XPRule $rule): JsonResponse
    {
        $rule->delete();

        return response()->json([
            'success' => true,
            'message' => 'XP rule deleted',
        ]);
    }

    public function listLevels(): JsonResponse
    {
        $levels = XPLevel::orderBy('level_number')->get();

        return response()->json([
            'success' => true,
            'data' => $levels,
        ]);
    }

    public function updateLevel(Request $request, XPLevel $level): JsonResponse
    {
        $validated = $request->validate([
            'level_name' => 'string|max:255',
            'xp_required' => 'integer|min:0',
            'description' => 'nullable|string',
        ]);

        $level->update($validated);

        return response()->json([
            'success' => true,
            'data' => $level,
        ]);
    }
}
