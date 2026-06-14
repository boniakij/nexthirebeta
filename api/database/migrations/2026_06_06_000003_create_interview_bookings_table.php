<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('interview_bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('uuid')->unique();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('package_id')->constrained('interview_packages')->onDelete('cascade');
            
            $table->date('booking_date');
            $table->string('status')->default('booked'); // booked, in_progress, completed, cancelled
            $table->boolean('paid')->default(false);
            $table->decimal('amount_paid', 10, 2)->default(0);
            
            // Feedback & Notes
            $table->text('student_notes')->nullable();
            $table->text('trainer_feedback')->nullable();
            $table->integer('rating')->nullable(); // 1-5 stars
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('student_id');
            $table->index('package_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interview_bookings');
    }
};
