<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Weekly Schedule
        Schema::create('trainer_weekly_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->integer('day_of_week'); // 0=Sunday, 1=Monday, ..., 6=Saturday
            $table->boolean('is_available')->default(false);
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->integer('slot_duration_minutes')->default(60);
            $table->integer('buffer_minutes')->default(15);
            $table->string('timezone')->default('UTC');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->unique(['trainer_id', 'day_of_week']);
            $table->index('trainer_id');
            $table->index('is_available');
        });

        // Availability Time Slots
        Schema::create('trainer_availability_slots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('slot_duration_minutes')->default(60);
            $table->enum('status', ['available', 'reserved', 'booked', 'blocked', 'expired', 'cancelled', 'unavailable'])->default('available');
            $table->foreignId('booking_id')->nullable()->constrained('interview_bookings')->nullOnDelete();
            $table->dateTime('reserved_until')->nullable();
            $table->timestamps();

            $table->index('trainer_id');
            $table->index('date');
            $table->index('status');
            $table->unique(['trainer_id', 'date', 'start_time']);
        });

        // Recurring Availability Rules
        Schema::create('trainer_recurring_availability_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->string('rule_name', 150);
            $table->enum('repeat_type', ['daily', 'weekly', 'custom'])->default('weekly');
            $table->json('repeat_days')->nullable(); // [0,1,2,3,4] for Mon-Fri
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('start_time');
            $table->time('end_time');
            $table->integer('slot_duration_minutes')->default(60);
            $table->integer('buffer_minutes')->default(15);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            $table->index('trainer_id');
            $table->index('repeat_type');
            $table->index('status');
        });

        // Blocked Dates / Holidays
        Schema::create('trainer_blocked_dates', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->enum('block_type', ['personal_leave', 'public_holiday', 'emergency', 'vacation'])->default('personal_leave');
            $table->date('date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->boolean('is_full_day')->default(true);
            $table->string('reason', 255)->nullable();
            $table->boolean('cancel_existing_bookings')->default(false);
            $table->timestamps();

            $table->index('trainer_id');
            $table->index('date');
            $table->index('block_type');
        });

        // Booking Rules
        Schema::create('trainer_booking_rules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->integer('minimum_notice_hours')->default(6);
            $table->integer('max_booking_days_ahead')->default(30);
            $table->boolean('allow_same_day_booking')->default(false);
            $table->boolean('allow_reschedule')->default(true);
            $table->integer('max_reschedule_count')->default(1);
            $table->integer('reschedule_deadline_hours')->default(12);
            $table->boolean('allow_cancellation')->default(true);
            $table->integer('cancellation_deadline_hours')->default(24);
            $table->boolean('auto_confirm_paid_bookings')->default(true);
            $table->string('timezone')->default('UTC');
            $table->timestamps();

            $table->unique('trainer_id');
            $table->index('trainer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_booking_rules');
        Schema::dropIfExists('trainer_blocked_dates');
        Schema::dropIfExists('trainer_recurring_availability_rules');
        Schema::dropIfExists('trainer_availability_slots');
        Schema::dropIfExists('trainer_weekly_schedules');
    }
};
