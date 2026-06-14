<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('trainers', function (Blueprint $table) {
            $table->string('display_name', 150)->nullable();
            $table->string('profile_photo_url')->nullable();
            $table->char('gender', 1)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('phone_number', 20)->nullable();
            $table->string('location', 150)->nullable();
            $table->string('time_zone', 50)->default('UTC');
            $table->string('preferred_language', 50)->default('English');
            $table->string('professional_title', 150)->nullable();
            $table->string('current_company', 150)->nullable();
            $table->string('current_designation', 150)->nullable();
            $table->string('industry', 100)->nullable();
            $table->string('trainer_type', 100)->nullable();
            $table->string('headline', 255)->nullable();
            $table->text('booking_value_statement')->nullable();
            $table->json('target_student_levels')->nullable();
            $table->json('preferred_session_modes')->nullable();
            $table->string('highest_degree', 100)->nullable();
            $table->string('institution_name', 200)->nullable();
            $table->year('graduation_year')->nullable();
            $table->string('field_of_study', 100)->nullable();
            $table->json('languages')->nullable();
            $table->json('social_links')->nullable();
            $table->enum('profile_status', ['draft', 'submitted', 'active', 'hidden', 'rejected', 'suspended'])->default('draft');
            $table->boolean('is_available_for_booking')->default(false);
            $table->boolean('is_featured')->default(false);
            $table->boolean('accepting_new_students')->default(true);
            $table->string('response_time', 50)->nullable();
            $table->text('cancellation_policy')->nullable();
            $table->text('refund_policy')->nullable();
            $table->enum('admin_review_status', ['pending', 'approved', 'rejected', 'suspended'])->default('pending');
            $table->text('admin_rejection_reason')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamp('profile_submitted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trainers', function (Blueprint $table) {
            $table->dropColumn([
                'display_name', 'profile_photo_url', 'gender', 'date_of_birth', 'phone_number',
                'location', 'time_zone', 'preferred_language', 'professional_title', 'current_company',
                'current_designation', 'industry', 'trainer_type', 'headline', 'booking_value_statement',
                'target_student_levels', 'preferred_session_modes', 'highest_degree', 'institution_name',
                'graduation_year', 'field_of_study', 'languages', 'social_links', 'profile_status',
                'is_available_for_booking', 'is_featured', 'accepting_new_students', 'response_time',
                'cancellation_policy', 'refund_policy', 'admin_review_status', 'admin_rejection_reason',
                'verified_at', 'profile_submitted_at'
            ]);
        });
    }
};
