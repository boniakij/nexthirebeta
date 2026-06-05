<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use App\Models\Student;
use App\Models\Trainer;
use App\Models\Company;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

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

        foreach ($studentEmails as $index => $email) {
            $user = User::factory()->create([
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => UserRole::Student,
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+880170000000' . ($index + 2),
            ]);

            Student::factory()->create([
                'user_id' => $user->id,
                'full_name' => $this->generateStudentName(),
            ]);

            $this->command->info("✓ Student created: {$email} (password: password123)");
        }

        // Create Sample Trainer Users
        $trainerEmails = [
            'trainer1@nexthire.com',
            'trainer2@nexthire.com',
            'trainer3@nexthire.com',
        ];

        foreach ($trainerEmails as $index => $email) {
            $user = User::factory()->create([
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => UserRole::Trainer,
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+880171000000' . ($index + 2),
            ]);

            Trainer::factory()->create([
                'user_id' => $user->id,
                'full_name' => $this->generateTrainerName(),
            ]);

            $this->command->info("✓ Trainer created: {$email} (password: password123)");
        }

        // Create Sample Company Users
        $companyEmails = [
            'company1@nexthire.com',
            'company2@nexthire.com',
            'company3@nexthire.com',
        ];

        foreach ($companyEmails as $index => $email) {
            $user = User::factory()->create([
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => UserRole::Company,
                'status' => 'active',
                'email_verified_at' => now(),
                'phone' => '+880172000000' . ($index + 2),
            ]);

            Company::factory()->create([
                'user_id' => $user->id,
            ]);

            $this->command->info("✓ Company created: {$email} (password: password123)");
        }

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
