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
        Schema::create('evaluations', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('interview_id')->unique();
            $table->unsignedBigInteger('trainer_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedTinyInteger('communication_score');
            $table->unsignedTinyInteger('technical_score');
            $table->unsignedTinyInteger('confidence_score');
            $table->unsignedTinyInteger('problem_solving_score');
            $table->unsignedTinyInteger('english_score');
            $table->unsignedTinyInteger('hr_readiness_score');
            $table->enum('overall_level', ['not_ready', 'beginner', 'intermediate', 'advanced', 'industry_ready']);
            $table->text('feedback_text')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('interview_id')->references('id')->on('interviews');
            $table->foreign('trainer_id')->references('id')->on('trainers');
            $table->foreign('student_id')->references('id')->on('students');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluations');
    }
};
