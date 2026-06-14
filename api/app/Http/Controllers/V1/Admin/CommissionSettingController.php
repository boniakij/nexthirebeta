<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\CommissionSetting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommissionSettingController extends Controller
{
    /**
     * List all commission settings
     */
    public function index(): JsonResponse
    {
        $settings = CommissionSetting::orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $settings,
        ]);
    }

    /**
     * Create new commission rule
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rule_name' => 'required|string|max:100|unique:commission_settings',
            'commission_type' => 'required|in:percentage,fixed',
            'commission_value' => 'required_if:commission_type,percentage|numeric|min:0|max:100',
            'fixed_amount' => 'required_if:commission_type,fixed|numeric|min:0',
            'applies_to' => 'required|in:global,trainer,package,category',
            'trainer_id' => 'nullable|exists:trainers,id',
            'package_id' => 'nullable|exists:interview_packages,id',
            'package_category' => 'nullable|string|max:100',
            'currency' => 'required|string|size:3',
            'priority' => 'required|integer|min:1',
            'status' => 'required|in:active,inactive',
        ]);

        $setting = CommissionSetting::create([
            ...$validated,
            'created_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commission rule created successfully.',
            'data' => $setting,
        ], 201);
    }

    /**
     * Update commission rule
     */
    public function update(Request $request, CommissionSetting $setting): JsonResponse
    {
        $validated = $request->validate([
            'rule_name' => 'string|max:100|unique:commission_settings,rule_name,' . $setting->id,
            'commission_type' => 'in:percentage,fixed',
            'commission_value' => 'numeric|min:0|max:100',
            'priority' => 'integer|min:1',
            'status' => 'in:active,inactive',
        ]);

        $setting->update([
            ...$validated,
            'updated_by' => auth()->id(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Commission rule updated successfully.',
            'data' => $setting,
        ]);
    }

    /**
     * Activate commission rule
     */
    public function activate(CommissionSetting $setting): JsonResponse
    {
        $setting->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'message' => 'Commission rule activated.',
            'data' => $setting,
        ]);
    }

    /**
     * Deactivate commission rule
     */
    public function deactivate(CommissionSetting $setting): JsonResponse
    {
        $setting->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Commission rule deactivated.',
            'data' => $setting,
        ]);
    }

    /**
     * Calculate commission preview
     */
    public function calculatePreview(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'package_price' => 'required|numeric|min:0',
            'trainer_id' => 'nullable|exists:trainers,id',
            'package_id' => 'nullable|exists:interview_packages,id',
            'package_category' => 'nullable|string|max:100',
        ]);

        // Find applicable commission rule
        $rule = CommissionSetting::where('status', 'active')
            ->orderBy('priority', 'desc')
            ->first();

        if (!$rule) {
            return response()->json([
                'success' => false,
                'message' => 'No active commission rule found',
            ], 400);
        }

        $commission = 0;
        if ($rule->commission_type === 'percentage') {
            $commission = ($validated['package_price'] * $rule->commission_value) / 100;
        } else {
            $commission = $rule->fixed_amount;
        }

        $trainerNetAmount = $validated['package_price'] - $commission;

        return response()->json([
            'success' => true,
            'data' => [
                'commission_rule_id' => $rule->id,
                'commission_rule_name' => $rule->rule_name,
                'commission_type' => $rule->commission_type,
                'commission_value' => (float)$rule->commission_value,
                'gross_amount' => (float)$validated['package_price'],
                'commission_amount' => (float)$commission,
                'trainer_net_amount' => (float)$trainerNetAmount,
                'currency' => 'BDT',
            ],
        ]);
    }
}
