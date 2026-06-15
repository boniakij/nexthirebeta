<?php

namespace Database\Seeders;

use App\Models\XPRule;
use Illuminate\Database\Seeder;

class XPRuleSeeder extends Seeder
{
    public function run(): void
    {
        $rules = [
            // Student rules
            ['rule_name' => 'First Interview', 'applies_to' => 'student', 'event_type' => 'first_interview', 'xp_amount' => 200, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'Complete Interview', 'applies_to' => 'student', 'event_type' => 'session_complete', 'xp_amount' => 100, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'Daily Login', 'applies_to' => 'student', 'event_type' => 'daily_login', 'xp_amount' => 10, 'frequency_limit' => 'once_per_day'],
            ['rule_name' => 'Profile Completion', 'applies_to' => 'student', 'event_type' => 'profile_100', 'xp_amount' => 150, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'Badge Unlock', 'applies_to' => 'student', 'event_type' => 'badge_unlock', 'xp_amount' => 25, 'frequency_limit' => 'unlimited'],
            ['rule_name' => 'Resume Upload', 'applies_to' => 'student', 'event_type' => 'resume_upload', 'xp_amount' => 30, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'CV Review Session', 'applies_to' => 'student', 'event_type' => 'cv_review', 'xp_amount' => 80, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'First Booking', 'applies_to' => 'student', 'event_type' => 'first_booking', 'xp_amount' => 50, 'frequency_limit' => 'once_per_event'],

            // Trainer rules
            ['rule_name' => 'Trainer First Session', 'applies_to' => 'trainer', 'event_type' => 'first_session', 'xp_amount' => 200, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'Trainer Session Complete', 'applies_to' => 'trainer', 'event_type' => 'session_complete', 'xp_amount' => 100, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => '5-Star Review', 'applies_to' => 'trainer', 'event_type' => 'five_star_review', 'xp_amount' => 75, 'frequency_limit' => 'unlimited'],
            ['rule_name' => 'First Package', 'applies_to' => 'trainer', 'event_type' => 'first_package', 'xp_amount' => 50, 'frequency_limit' => 'once_per_event'],
            ['rule_name' => 'Trainer Profile 100%', 'applies_to' => 'trainer', 'event_type' => 'trainer_profile_100', 'xp_amount' => 150, 'frequency_limit' => 'once_per_event'],
        ];

        foreach ($rules as $rule) {
            XPRule::updateOrCreate(
                ['event_type' => $rule['event_type']],
                [...$rule, 'status' => 'active']
            );
        }
    }
}
