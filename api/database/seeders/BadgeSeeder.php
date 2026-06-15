<?php

namespace Database\Seeders;

use App\Models\Badge;
use Illuminate\Database\Seeder;

class BadgeSeeder extends Seeder
{
    public function run(): void
    {
        $badges = [
            // Interview Badges
            ['slug' => 'first_interview', 'name' => 'First Interview', 'description' => 'Complete your first mock interview', 'category' => 'interview', 'applies_to' => 'student', 'xp_reward' => 200, 'unlock_condition_json' => ['type' => 'session_count', 'value' => 1]],
            ['slug' => 'ten_interviews', 'name' => '10 Interviews', 'description' => 'Complete 10 mock interviews', 'category' => 'milestone', 'applies_to' => 'student', 'xp_reward' => 300, 'unlock_condition_json' => ['type' => 'session_count', 'value' => 10]],
            ['slug' => 'fifty_interviews', 'name' => '50 Interviews', 'description' => 'Complete 50 mock interviews', 'category' => 'milestone', 'applies_to' => 'student', 'xp_reward' => 1000, 'unlock_condition_json' => ['type' => 'session_count', 'value' => 50]],

            // Skill Badges
            ['slug' => 'hr_master', 'name' => 'HR Master', 'description' => 'Complete 5 HR interview sessions', 'category' => 'skill', 'applies_to' => 'student', 'xp_reward' => 250, 'unlock_condition_json' => ['type' => 'domain_session_count', 'domain' => 'HR Interview', 'value' => 5]],
            ['slug' => 'coding_expert', 'name' => 'Coding Expert', 'description' => 'Score 9+ in technical score on 3 sessions', 'category' => 'skill', 'applies_to' => 'student', 'xp_reward' => 300, 'unlock_condition_json' => ['type' => 'evaluation_score_count', 'score_field' => 'technical_score', 'score_value' => 9, 'count' => 3]],
            ['slug' => 'communication_ace', 'name' => 'Communication Ace', 'description' => 'Score 9+ in communication on 5 sessions', 'category' => 'skill', 'applies_to' => 'student', 'xp_reward' => 300, 'unlock_condition_json' => ['type' => 'evaluation_score_count', 'score_field' => 'communication_score', 'score_value' => 9, 'count' => 5]],
            ['slug' => 'company_ready', 'name' => 'Company Ready', 'description' => 'Receive Industry Ready evaluation', 'category' => 'skill', 'applies_to' => 'student', 'xp_reward' => 300, 'unlock_condition_json' => ['type' => 'evaluation_status', 'status' => 'industry_ready']],

            // Streak Badges
            ['slug' => 'seven_day_streak', 'name' => '7-Day Streak', 'description' => 'Login 7 consecutive days', 'category' => 'streak', 'applies_to' => 'student', 'xp_reward' => 50, 'unlock_condition_json' => ['type' => 'login_streak', 'days' => 7]],
            ['slug' => 'thirty_day_streak', 'name' => '30-Day Streak', 'description' => 'Login 30 consecutive days', 'category' => 'streak', 'applies_to' => 'student', 'xp_reward' => 200, 'unlock_condition_json' => ['type' => 'login_streak', 'days' => 30]],

            // Profile Badges
            ['slug' => 'profile_champion', 'name' => 'Profile Champion', 'description' => 'Complete profile 100%', 'category' => 'profile', 'applies_to' => 'student', 'xp_reward' => 150, 'unlock_condition_json' => ['type' => 'profile_complete']],
            ['slug' => 'resume_ready', 'name' => 'Resume Ready', 'description' => 'Upload resume', 'category' => 'profile', 'applies_to' => 'student', 'xp_reward' => 30, 'unlock_condition_json' => ['type' => 'resume_uploaded']],
            ['slug' => 'linkedin_ready', 'name' => 'LinkedIn Ready', 'description' => 'Add LinkedIn URL', 'category' => 'profile', 'applies_to' => 'student', 'xp_reward' => 30, 'unlock_condition_json' => ['type' => 'linkedin_added']],

            // Leaderboard Badges
            ['slug' => 'top_100_bangladesh', 'name' => 'Top 100 Bangladesh', 'description' => 'Rank in Bangladesh top 100', 'category' => 'leaderboard', 'applies_to' => 'student', 'xp_reward' => 500, 'unlock_condition_json' => ['type' => 'country_rank', 'country' => 'BD', 'rank' => 100]],
            ['slug' => 'global_top_500', 'name' => 'Global Top Performer', 'description' => 'Rank in global top 500', 'category' => 'leaderboard', 'applies_to' => 'student', 'xp_reward' => 500, 'unlock_condition_json' => ['type' => 'global_rank', 'rank' => 500]],

            // Trainer Badges
            ['slug' => 'verified_trainer', 'name' => 'Verified Trainer', 'description' => 'Admin approves trainer profile', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 100, 'unlock_condition_json' => ['type' => 'trainer_verified']],
            ['slug' => 'trainer_first_session', 'name' => 'First Session Completed', 'description' => 'Complete first paid session', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 200, 'unlock_condition_json' => ['type' => 'trainer_session_count', 'value' => 1]],
            ['slug' => 'top_rated_trainer', 'name' => 'Top Rated Trainer', 'description' => 'Maintain 4.8+ rating after 25 sessions', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 500, 'unlock_condition_json' => ['type' => 'trainer_rating', 'average_rating' => 4.8, 'min_sessions' => 25]],
            ['slug' => 'popular_trainer', 'name' => 'Popular Trainer', 'description' => 'Complete 100 sessions', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 1500, 'unlock_condition_json' => ['type' => 'trainer_session_count', 'value' => 100]],
            ['slug' => 'package_creator', 'name' => 'Package Creator', 'description' => 'Create first active package', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 50, 'unlock_condition_json' => ['type' => 'trainer_package_count', 'value' => 1]],
            ['slug' => 'student_favorite', 'name' => 'Student Favorite', 'description' => 'Receive 20 five-star reviews', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 700, 'unlock_condition_json' => ['type' => 'five_star_reviews', 'count' => 20]],
            ['slug' => 'earning_milestone', 'name' => 'Earning Milestone', 'description' => 'Earn ৳100,000 total trainer revenue', 'category' => 'trainer', 'applies_to' => 'trainer', 'xp_reward' => 1000, 'unlock_condition_json' => ['type' => 'trainer_earnings', 'amount' => 100000]],
        ];

        foreach ($badges as $badge) {
            Badge::updateOrCreate(
                ['slug' => $badge['slug']],
                [...$badge, 'status' => 'active', 'sort_order' => 0]
            );
        }
    }
}
