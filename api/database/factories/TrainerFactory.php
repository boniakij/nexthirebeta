<?php

namespace Database\Factories;

use App\Models\Trainer;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Trainer>
 */
class TrainerFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $expertise = [
            ['Web Development', 'React', 'Node.js'],
            ['Python Development', 'Django', 'FastAPI'],
            ['Mobile Development', 'React Native', 'Flutter'],
            ['Cloud Architecture', 'AWS', 'Azure'],
            ['Data Science', 'Machine Learning', 'TensorFlow'],
            ['DevOps', 'Kubernetes', 'Docker'],
        ];

        $certifications = [
            ['AWS Solutions Architect', 'AWS Developer Associate'],
            ['Certified Kubernetes Administrator', 'Docker Certified Associate'],
            ['Google Cloud Professional'],
            ['Microsoft Azure Solutions Architect'],
            ['Oracle Certified Associate Java'],
        ];

        $companies = [
            ['TechCorp Bangladesh', '5 years'],
            ['Digital Solutions Ltd', '8 years'],
            ['Cloud Innovations Inc', '6 years'],
            ['Data Systems Bangladesh', '7 years'],
            ['Mobile First Technologies', '4 years'],
        ];

        return [
            'full_name' => fake()->name(),
            'bio' => fake()->paragraph(),
            'expertise_domains' => fake()->randomElement($expertise),
            'years_experience' => fake()->numberBetween(2, 15),
            'hourly_rate' => fake()->numberBetween(30, 100),
            'average_rating' => fake()->numberBetween(40, 50) / 10,
            'total_reviews' => fake()->numberBetween(5, 100),
            'total_sessions' => fake()->numberBetween(10, 500),
            'is_approved' => fake()->boolean(80),
            'approved_at' => fake()->dateTimeThisYear(),
            'payout_info' => [
                'bank_account' => 'XXXX' . fake()->numerify('####'),
                'bank_name' => 'Bangladesh Bank',
            ],
            'country_code' => 'BD',
        ];
    }
}
