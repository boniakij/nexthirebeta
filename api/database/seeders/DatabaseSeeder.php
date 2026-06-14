<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Student;
use App\Models\Trainer;
use App\Models\Company;
use App\Models\InterviewPackage;
use App\Models\InterviewBooking;
use App\Models\Review;
use App\Models\Payment;
use App\Models\TrainerAvailability;
use App\Models\Badge;
use App\Models\UserBadge;
use App\Models\Notification;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{


    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::factory()->create([
            'email' => 'admin@nexthire.com',
            'password' => Hash::make('admin@123'),
            'role' => UserRole::Admin,
            'status' => 'active',
            'email_verified_at' => now(),
            'phone' => '+8801700000001',
        ]);
        $this->command->info("✓ Admin created: admin@nexthire.com (password: admin@123)");

        // Create Sample Student Users
        $studentEmails = [
            'student1@nexthire.com',
            'student2@nexthire.com',
            'student3@nexthire.com',
            'student4@nexthire.com',
            'student5@nexthire.com',
        ];

        $students = [];
        foreach ($studentEmails as $index => $email) {
            $user = User::factory()->create([
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => UserRole::Student,
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+880170000000' . ($index + 2),
            ]);

            $student = Student::factory()->create([
                'user_id' => $user->id,
                'full_name' => $this->generateStudentName(),
            ]);
            $students[] = $student;

            $this->command->info("✓ Student created: {$email} (password: password123)");
        }

        // Create Sample Trainer Users
        $trainerEmails = [
            'trainer1@nexthire.com',
            'trainer2@nexthire.com',
            'trainer3@nexthire.com',
        ];

        $trainers = [];
        foreach ($trainerEmails as $index => $email) {
            $user = User::factory()->create([
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => UserRole::Trainer,
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+880171000000' . ($index + 2),
            ]);

            $trainer = Trainer::factory()->create([
                'user_id' => $user->id,
                'full_name' => $this->generateTrainerName(),
            ]);
            $trainers[] = $trainer;

            $this->command->info("✓ Trainer created: {$email} (password: password123)");
        }

        // Create Sample Company Users
        $companyEmails = [
            'company1@nexthire.com',
            'company2@nexthire.com',
            'company3@nexthire.com',
        ];

        $companies = [];
        foreach ($companyEmails as $index => $email) {
            $user = User::factory()->create([
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => UserRole::Company,
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+880172000000' . ($index + 2),
            ]);

            $company = Company::factory()->create([
                'user_id' => $user->id,
            ]);
            $companies[] = $company;

            $this->command->info("✓ Company created: {$email} (password: password123)");
        }

        // Create Interview Packages and Standard Packages for Trainers
        $this->command->info("\n📦 Creating Interview Packages and Standard Packages...");
        foreach ($trainers as $trainer) {
            $packages = [
                ['level' => 'beginner', 'price' => 2000, 'duration' => 30],
                ['level' => 'intermediate', 'price' => 3500, 'duration' => 45],
                ['level' => 'advanced', 'price' => 5000, 'duration' => 60],
            ];
            foreach ($packages as $pkg) {
                InterviewPackage::create([
                    'uuid' => \Illuminate\Support\Str::uuid(),
                    'trainer_id' => $trainer->id,
                    'title' => ucfirst($pkg['level']) . " Interview Prep",
                    'category' => 'Technical',
                    'interview_type' => 'mock_interview',
                    'difficulty_level' => $pkg['level'],
                    'language' => 'English',
                    'short_description' => ucfirst($pkg['level']) . " level interview preparation",
                    'description' => ucfirst($pkg['level']) . " level interview preparation course with mock interviews",
                    'number_of_sessions' => match($pkg['level']) {
                        'beginner' => 3,
                        'intermediate' => 5,
                        'advanced' => 7,
                    },
                    'price' => $pkg['price'],
                    'session_duration' => $pkg['duration'],
                    'package_validity' => 90,
                    'max_students' => 10,
                    'session_type' => 'one_to_one',
                    'days_of_week' => json_encode(['monday', 'wednesday', 'friday']),
                    'session_time' => '14:00',
                    'timezone' => 'Asia/Dhaka',
                    'start_date' => now()->toDateString(),
                    'end_date' => now()->addDays(90)->toDateString(),
                    'repeat_weekly' => true,
                    'includes_cv_review' => true,
                    'includes_career_guideline' => true,
                    'includes_mock_interview' => true,
                    'status' => 'active',
                ]);

                // Create Standard Package
                \App\Models\Package::create([
                    'trainer_id' => $trainer->id,
                    'title' => ucfirst($pkg['level']) . " Interview Prep (" . match($pkg['level']) {
                        'beginner' => 3,
                        'intermediate' => 5,
                        'advanced' => 7,
                    } . " Sessions)",
                    'description' => ucfirst($pkg['level']) . " level interview preparation course with mock interviews",
                    'price' => $pkg['price'],
                    'session_count' => match($pkg['level']) {
                        'beginner' => 3,
                        'intermediate' => 5,
                        'advanced' => 7,
                    },
                    'duration_minutes' => $pkg['duration'],
                    'interview_type' => 'mock_interview',
                    'domain' => 'Software Engineering',
                    'difficulty' => $pkg['level'] === 'expert' ? 'advanced' : ($pkg['level'] === 'beginner' ? 'beginner' : 'intermediate'),
                    'language' => 'English',
                    'is_live' => true,
                    'includes_cv_review' => true,
                    'is_active' => true,
                ]);
            }
        }
        $this->command->info("✓ Interview Packages and Standard Packages created");

        // Create Trainer Availability
        $this->command->info("📅 Creating Trainer Availability...");
        foreach ($trainers as $trainer) {
            for ($day = 1; $day <= 7; $day++) {
                TrainerAvailability::create([
                    'trainer_id' => $trainer->id,
                    'date' => now()->addDays($day)->toDateString(),
                    'start_time' => '09:00:00',
                    'end_time' => '18:00:00',
                    'is_booked' => false,
                ]);
            }
        }
        $this->command->info("✓ Trainer Availability created");

        // Create Interview Bookings
        $this->command->info("🎯 Creating Interview Bookings...");
        $packages = InterviewPackage::all();
        $studentCollection = collect($students);
        foreach ($studentCollection->slice(0, 3) as $index => $student) {
            foreach ($packages->slice(0, 2) as $package) {
                InterviewBooking::create([
                    'uuid' => \Illuminate\Support\Str::uuid(),
                    'student_id' => $student->id,
                    'package_id' => $package->id,
                    'booking_date' => now()->addDays($index + 1)->toDateString(),
                    'status' => $index === 0 ? 'completed' : 'booked',
                    'paid' => $index === 0 ? true : false,
                    'amount_paid' => $index === 0 ? 3500 : 0,
                    'student_notes' => 'Interview preparation session',
                    'trainer_feedback' => $index === 0 ? 'Great performance! Keep practicing.' : null,
                    'rating' => $index === 0 ? 5 : null,
                ]);
            }
        }
        $this->command->info("✓ Interview Bookings created");

        // Create Notifications
        $this->command->info("🔔 Creating Notifications...");
        foreach ($studentCollection->slice(0, 2) as $student) {
            Notification::create([
                'id' => \Illuminate\Support\Str::uuid(),
                'user_id' => $student->user_id,
                'type' => 'session_reminder',
                'title' => 'Interview Session Reminder',
                'body' => 'You have an interview session coming up tomorrow',
                'data' => json_encode(['session_id' => 1]),
                'read_at' => null,
            ]);
        }
        $this->command->info("✓ Notifications created");

        $this->command->info("\n" . str_repeat('=', 60));
        $this->command->info("Test Data Seeding Complete!");
        $this->command->info(str_repeat('=', 60));
        $this->command->info("\nLogin Credentials:");
        $this->command->info("Admin:   admin@nexthire.com / admin@123");
        $this->command->info("Student: student1@nexthire.com / password123");
        $this->command->info("Trainer: trainer1@nexthire.com / password123");
        $this->command->info("Company: company1@nexthire.com / password123");
    }

    private function generateStudentName(): string
    {
        $firstNames = ['Ahmed', 'Fatima', 'Hassan', 'Ayesha', 'Muhammad', 'Zainab', 'Ali', 'Noor'];
        $lastNames = ['Khan', 'Ahmed', 'Hassan', 'Rahman', 'Malik', 'Hussain', 'Iqbal', 'Sharif'];

        return fake()->randomElement($firstNames) . ' ' . fake()->randomElement($lastNames);
    }

    private function generateTrainerName(): string
    {
        $firstNames = ['Dr.', 'Prof.', 'Eng.'];
        $names = [
            'Reza Hasan',
            'Nasim Ahmed',
            'Karim Hassan',
            'Samir Khan',
            'Habib Rahman',
            'Akram Ali',
        ];

        return fake()->randomElement($firstNames) . ' ' . fake()->randomElement($names);
    }
}
