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
        Schema::create('interviews', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('trainer_id');
            $table->unsignedBigInteger('package_id');
            $table->unsignedBigInteger('availability_id')->nullable();
            $table->timestamp('scheduled_at');
            $table->unsignedSmallInteger('duration_minutes');
            $table->enum('status', ['scheduled', 'in_progress', 'completed', 'cancelled'])->default('scheduled');
            $table->string('meeting_link', 500)->nullable();
            $table->string('meeting_id', 200)->nullable();
            $table->string('agora_channel', 200)->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->text('cancelled_reason')->nullable();
            $table->unsignedInteger('xp_awarded')->default(0);
            $table->timestamps();
            $table->foreign('student_id')->references('id')->on('students');
            $table->foreign('trainer_id')->references('id')->on('trainers');
            $table->foreign('package_id')->references('id')->on('packages');
            $table->index('student_id');
            $table->index('trainer_id');
            $table->index('scheduled_at');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
