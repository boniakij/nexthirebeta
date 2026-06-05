<?php

namespace Database\Factories;

use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     */
    public function definition(): array
    {
        $industries = [
            'Information Technology',
            'Software Development',
            'Financial Services',
            'E-Commerce',
            'Healthcare Technology',
            'Education Tech',
            'Telecommunications',
        ];

        $sizes = ['1-10', '11-50', '51-200', '201-500', '500+'];

        return [
            'company_name' => fake()->company(),
            'company_website' => 'https://' . fake()->domainName(),
            'industry' => fake()->randomElement($industries),
            'company_size' => fake()->randomElement($sizes),
            'registration_number' => 'REG-' . fake()->numerify('########'),
            'kyc_document_path' => null,
            'kyc_status' => fake()->randomElement(['pending', 'verified', 'rejected']),
            'is_verified' => fake()->boolean(70),
            'verified_at' => fake()->dateTimeThisMonth(),
            'hr_contact_name' => fake()->name(),
            'hr_contact_email' => fake()->companyEmail(),
            'logo_path' => null,
            'country_code' => 'BD',
        ];
    }
}
