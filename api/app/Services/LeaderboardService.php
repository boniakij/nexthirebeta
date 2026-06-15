<?php

namespace App\Services;

use App\Models\UserGamificationStats;
use Illuminate\Support\Facades\DB;

class LeaderboardService
{
    public function updateGlobalLeaderboard(): void
    {
        $users = UserGamificationStats::orderBy('total_xp', 'desc')
            ->get();

        foreach ($users as $index => $user) {
            $user->update(['global_rank' => $index + 1]);
        }
    }

    public function updateCountryLeaderboard(string $countryCode): void
    {
        $users = UserGamificationStats::join('users', 'user_gamification_stats.user_id', '=', 'users.id')
            ->where('users.country_code', $countryCode)
            ->orderBy('user_gamification_stats.total_xp', 'desc')
            ->select('user_gamification_stats.*')
            ->get();

        foreach ($users as $index => $user) {
            $user->update(['country_rank' => $index + 1]);
        }
    }

    public function getGlobalLeaderboard(int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return UserGamificationStats::orderBy('total_xp', 'desc')
            ->limit($limit)
            ->get();
    }

    public function getCountryLeaderboard(string $countryCode, int $limit = 100): \Illuminate\Database\Eloquent\Collection
    {
        return UserGamificationStats::join('users', 'user_gamification_stats.user_id', '=', 'users.id')
            ->where('users.country_code', $countryCode)
            ->orderBy('user_gamification_stats.total_xp', 'desc')
            ->select('user_gamification_stats.*')
            ->limit($limit)
            ->get();
    }

    public function getUserRank(int $userId): ?array
    {
        $user = UserGamificationStats::where('user_id', $userId)->first();

        if (!$user) {
            return null;
        }

        return [
            'user_id' => $userId,
            'total_xp' => $user->total_xp,
            'current_level' => $user->current_level,
            'badges_count' => $user->badges_count,
            'global_rank' => $user->global_rank,
            'country_rank' => $user->country_rank,
            'global_rank_percentile' => $this->getGlobalPercentile($user->global_rank),
            'country_rank_percentile' => $this->getCountryPercentile($user->country_rank),
        ];
    }

    private function getGlobalPercentile(?int $rank): float
    {
        if (!$rank) {
            return 0;
        }

        $totalUsers = UserGamificationStats::count();
        return round((1 - ($rank / $totalUsers)) * 100, 2);
    }

    private function getCountryPercentile(?int $rank): float
    {
        if (!$rank) {
            return 0;
        }

        $totalUsers = UserGamificationStats::join('users', 'user_gamification_stats.user_id', '=', 'users.id')
            ->count();

        return round((1 - ($rank / $totalUsers)) * 100, 2);
    }
}
