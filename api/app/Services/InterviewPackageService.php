<?php

namespace App\Services;

use App\Models\InterviewPackage;
use App\Models\Trainer;

class InterviewPackageService
{
    public function createPackage(Trainer $trainer, array $data): InterviewPackage
    {
        $data['trainer_id'] = $trainer->id;
        
        return InterviewPackage::create($data);
    }

    public function getAvailablePackages(array $filters = [])
    {
        $query = InterviewPackage::where('status', 'active')
            ->with('trainer');

        if (isset($filters['category'])) {
            $query->where('category', $filters['category']);
        }

        if (isset($filters['difficulty_level'])) {
            $query->where('difficulty_level', $filters['difficulty_level']);
        }

        if (isset($filters['trainer_id'])) {
            $query->where('trainer_id', $filters['trainer_id']);
        }

        if (isset($filters['search'])) {
            $search = $filters['search'];
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
        }

        return $query->paginate($filters['per_page'] ?? 15);
    }

    public function getPackageStats(InterviewPackage $package): array
    {
        return [
            'total_bookings' => $package->bookings()->count(),
            'completed_bookings' => $package->bookings()->where('status', 'completed')->count(),
            'average_rating' => $package->bookings()->whereNotNull('rating')->avg('rating') ?? 0,
            'next_session' => $this->getNextSessionDate($package),
        ];
    }

    private function getNextSessionDate(InterviewPackage $package): ?string
    {
        // Calculate next session based on days_of_week and session_time
        // This is a placeholder implementation
        return now()->format('Y-m-d H:i');
    }
}
