<?php

namespace Database\Factories;

use App\Models\Student;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Student>
 */
class StudentFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $skills = [
            ['React', 'TypeScript', 'JavaScript'],
            ['Python', 'Django', 'PostgreSQL'],
            ['Node.js', 'Express', 'MongoDB'],
            ['Java', 'Spring Boot', 'MySQL'],
            ['Go', 'Microservices', 'Docker'],
            ['Vue.js', 'Nuxt', 'Tailwind CSS'],
        ];

        $universities = [
            'Bangladesh University of Engineering and Technology (BUET)',
            'Dhaka University',
            'Independent University, Bangladesh (IUB)',
            'BRAC University',
            'North South University',
            'University of Liberal Arts Bangladesh',
        ];

        $departments = [
            'Computer Science',
            'Software Engineering',
            'Information Technology',
            'Electronics & Telecommunication',
            'Electrical Engineering',
        ];

        $jobRoles = [
            'Frontend Developer',
            'Backend Developer',
            'Full Stack Developer',
            'Data Engineer',
            'DevOps Engineer',
            'Mobile Developer',
            'Quality Assurance Engineer',
        ];

        return [
            'full_name' => fake()->name(),
            'university' => fake()->randomElement($universities),
            'department' => fake()->randomElement($departments),
            'graduation_year' => fake()->numberBetween(2023, 2027),
            'skills' => fake()->randomElement($skills),
            'preferred_job_role' => fake()->randomElement($jobRoles),
            'linkedin_url' => 'https://linkedin.com/in/' . fake()->slug(),
            'github_url' => 'https://github.com/' . fake()->slug(),
            'resume_path' => null,
            'profile_completion' => fake()->numberBetween(50, 100),
            'total_xp' => fake()->numberBetween(100, 5000),
            'current_level' => fake()->numberBetween(1, 20),
            'streak_days' => fake()->numberBetween(0, 100),
            'last_active_at' => fake()->dateTimeThisMonth(),
            'country_code' => 'BD',
        ];
    }
}
