<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interview_packages', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            
            // Basic Information
            $table->string('title');
            $table->string('category'); // Cybersecurity, Web Development, etc.
            $table->string('interview_type'); // mock_interview, real_interview
            $table->string('difficulty_level'); // beginner, intermediate, advanced, expert
            $table->string('language')->default('English');
            $table->text('short_description');
            $table->longText('description');
            
            // Package Information
            $table->integer('number_of_sessions');
            $table->decimal('price', 10, 2);
            $table->decimal('discount_price', 10, 2)->nullable();
            $table->integer('session_duration'); // in minutes
            $table->integer('package_validity'); // in days
            $table->integer('max_students')->default(10);
            $table->string('session_type'); // one_to_one, group
            
            // Schedule Information
            $table->json('days_of_week'); // ['monday', 'wednesday', 'thursday']
            $table->string('session_time'); // HH:MM format
            $table->string('timezone')->default('UTC');
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->boolean('repeat_weekly')->default(true);
            
            // Package Includes
            $table->boolean('includes_cv_review')->default(false);
            $table->boolean('includes_career_guideline')->default(false);
            $table->boolean('includes_mock_interview')->default(true);
            
            // Status
            $table->string('status')->default('active'); // active, paused, archived
            $table->integer('total_bookings')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('trainer_id');
            $table->index('category');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interview_packages');
    }
};
