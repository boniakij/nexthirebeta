<?php

namespace Database\Seeders;

use App\Models\XPLevel;
use Illuminate\Database\Seeder;

class XPLevelSeeder extends Seeder
{
    public function run(): void
    {
        $levels = [
            ['level_number' => 1, 'level_name' => 'Newcomer', 'xp_required' => 0],
            ['level_number' => 2, 'level_name' => 'Explorer', 'xp_required' => 200],
            ['level_number' => 3, 'level_name' => 'Learner', 'xp_required' => 500],
            ['level_number' => 4, 'level_name' => 'Challenger', 'xp_required' => 1000],
            ['level_number' => 5, 'level_name' => 'Achiever', 'xp_required' => 2000],
            ['level_number' => 6, 'level_name' => 'Professional', 'xp_required' => 3500],
            ['level_number' => 7, 'level_name' => 'Expert', 'xp_required' => 5500],
            ['level_number' => 8, 'level_name' => 'Elite', 'xp_required' => 8000],
            ['level_number' => 9, 'level_name' => 'Master', 'xp_required' => 11500],
            ['level_number' => 10, 'level_name' => 'Industry Ready', 'xp_required' => 15000],
        ];

        foreach ($levels as $level) {
            XPLevel::updateOrCreate(
                ['level_number' => $level['level_number']],
                $level
            );
        }
    }
}
