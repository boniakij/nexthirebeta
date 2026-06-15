<?php

namespace App\Http\Controllers\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\PointsLedger;
use App\Models\UserGamificationStats;
use App\Models\XPLevel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class XPAdjustmentController extends Controller
{
    public function adjustXP(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|integer|exists:users,id',
            'xp_amount' => 'required|integer',
            'reason' => 'required|string|max:500',
            'reference' => 'nullable|string|max:255',
        ]);

        return DB::transaction(function () use ($validated) {
            // Create ledger entry
            $ledger = PointsLedger::create([
                'user_id' => $validated['user_id'],
                'role' => $this->getUserRole($validated['user_id']),
                'xp_amount' => $validated['xp_amount'],
                'event_type' => 'admin_adjustment',
                'event_label' => "Admin adjustment: {$validated['reason']}",
                'reference_type' => 'admin_adjustment',
                'metadata_json' => [
                    'reason' => $validated['reason'],
                    'reference' => $validated['reference'] ?? null,
                    'admin_id' => auth()->id(),
                ],
            ]);

            // Update stats
            $stats = UserGamificationStats::where('user_id', $validated['user_id'])->first();
            if ($stats) {
                $stats->increment('total_xp', $validated['xp_amount']);
                $this->recalculateLevel($stats);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'ledger_id' => $ledger->id,
                    'new_total_xp' => $stats->total_xp ?? 0,
                    'new_level' => $stats->current_level ?? 1,
                ],
            ]);
        });
    }

    public function getAdjustmentHistory(int $userId): JsonResponse
    {
        $adjustments = PointsLedger::where('user_id', $userId)
            ->where('event_type', 'admin_adjustment')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn ($entry) => [
                'id' => $entry->id,
                'xp_amount' => $entry->xp_amount,
                'reason' => $entry->metadata_json['reason'] ?? '',
                'admin_id' => $entry->metadata_json['admin_id'] ?? null,
                'created_at' => $entry->created_at,
            ]);

        return response()->json([
            'success' => true,
            'data' => $adjustments,
        ]);
    }

    public function reverseAdjustment(int $ledgerId): JsonResponse
    {
        $entry = PointsLedger::find($ledgerId);

        if (!$entry || $entry->event_type !== 'admin_adjustment') {
            return response()->json(['success' => false, 'message' => 'Entry not found'], 404);
        }

        return DB::transaction(function () use ($entry) {
            // Create reverse entry
            $reverse = PointsLedger::create([
                'user_id' => $entry->user_id,
                'role' => $entry->role,
                'xp_amount' => -$entry->xp_amount,
                'event_type' => 'admin_adjustment_reversal',
                'event_label' => "Reversal of adjustment: {$entry->event_label}",
                'reference_type' => 'admin_adjustment',
                'reference_id' => $entry->id,
                'metadata_json' => [
                    'reversed_entry_id' => $entry->id,
                    'admin_id' => auth()->id(),
                ],
            ]);

            // Update stats
            $stats = UserGamificationStats::where('user_id', $entry->user_id)->first();
            if ($stats) {
                $stats->decrement('total_xp', $entry->xp_amount);
                $this->recalculateLevel($stats);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'reversal_id' => $reverse->id,
                    'new_total_xp' => $stats->total_xp ?? 0,
                    'new_level' => $stats->current_level ?? 1,
                ],
            ]);
        });
    }

    private function getUserRole(int $userId): string
    {
        $user = \DB::table('users')->find($userId);
        return $user->role ?? 'student';
    }

    private function recalculateLevel(UserGamificationStats $stats): void
    {
        $nextLevel = XPLevel::where('xp_required', '<=', $stats->total_xp)
            ->orderBy('xp_required', 'desc')
            ->first();

        if ($nextLevel) {
            $stats->update(['current_level' => $nextLevel->level_number]);
        } else {
            $stats->update(['current_level' => 1]);
        }
    }
}
