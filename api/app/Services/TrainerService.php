<?php

namespace App\Services;

use App\Models\Trainer;
use App\Models\TrainerAvailability;
use Illuminate\Pagination\Paginator;

class TrainerService
{
    /**
     * Get approved trainers with filtering options
     */
    public function getApprovedTrainers(
        $domain = null,
        $minRating = null,
        $page = 1,
        $perPage = 15
    ): Paginator {
        $query = Trainer::query()
            ->where('is_approved', true)
            ->with('user');

        if ($domain) {
            $query->whereJsonContains('expertise_domains', $domain);
        }

        if ($minRating !== null) {
            $query->where('average_rating', '>=', $minRating);
        }

        return $query->paginate($perPage, ['*'], 'page', $page);
    }

    /**
     * Get available slots for a trainer on a specific date
     */
    public function getAvailableSlots($trainerId, $date)
    {
        return TrainerAvailability::query()
            ->where('trainer_id', $trainerId)
            ->where('date', $date)
            ->where('is_booked', false)
            ->get();
    }

    /**
     * Format trainer profile for API response
     */
    public function formatTrainerProfile(Trainer $trainer): array
    {
        return [
            'id' => $trainer->id,
            'name' => $trainer->full_name,
            'bio' => $trainer->bio,
            'expertise_domains' => $trainer->expertise_domains,
            'years_experience' => $trainer->years_experience,
            'certifications' => $trainer->certifications,
            'company_experience' => $trainer->company_experience,
            'hourly_rate' => $trainer->hourly_rate,
            'average_rating' => $trainer->average_rating,
            'total_reviews' => $trainer->total_reviews,
            'total_sessions' => $trainer->total_sessions,
            'is_approved' => $trainer->is_approved,
            'country_code' => $trainer->country_code,
            'user' => [
                'id' => $trainer->user->id,
                'email' => $trainer->user->email,
                'phone' => $trainer->user->phone,
                'profile_photo' => $trainer->user->profile_photo,
            ],
        ];
    }

    /**
     * Get trainer dashboard statistics
     */
    public function getDashboardStats(Trainer $trainer): array
    {
        $totalEarnings = $trainer->interviews()
            ->whereHas('payments', function ($q) {
                $q->where('status', 'paid');
            })
            ->count() * ($trainer->hourly_rate ?? 0);

        return [
            'total_sessions' => $trainer->total_sessions,
            'total_earnings' => $totalEarnings,
            'average_rating' => $trainer->average_rating,
            'total_reviews' => $trainer->total_reviews,
            'pending_sessions' => $trainer->interviews()
                ->where('status', 'scheduled')
                ->count(),
            'completed_sessions' => $trainer->interviews()
                ->where('status', 'completed')
                ->count(),
        ];
    }

    /**
     * Get trainer earnings breakdown
     */
    public function getEarnings(Trainer $trainer, $days = 30): array
    {
        $interviews = $trainer->interviews()
            ->with('payments')
            ->where('status', 'completed')
            ->where('completed_at', '>=', now()->subDays($days))
            ->get();

        $totalEarnings = $interviews->sum(function ($interview) {
            return $interview->payments()
                ->where('status', 'paid')
                ->sum('amount') * 0.8; // 20% commission
        });

        return [
            'period_days' => $days,
            'total_earnings' => $totalEarnings,
            'completed_sessions' => $interviews->count(),
            'average_per_session' => $interviews->count() > 0
                ? $totalEarnings / $interviews->count()
                : 0,
        ];
    }

    /**
     * Get trainer sessions
     */
    public function getSessions(Trainer $trainer, $status = null, $page = 1, $perPage = 15)
    {
        $query = $trainer->interviews()->with('student', 'package', 'evaluation');

        if ($status) {
            $query->where('status', $status);
        }

        return $query->orderBy('scheduled_at', 'desc')->paginate($perPage, ['*'], 'page', $page);
    }
}
