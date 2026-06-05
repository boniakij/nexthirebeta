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
        Schema::create('students', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('full_name', 200);
            $table->string('university', 300)->nullable();
            $table->string('department', 200)->nullable();
            $table->smallInteger('graduation_year')->nullable();
            $table->json('skills')->default('[]');
            $table->string('preferred_job_role', 200)->nullable();
            $table->string('linkedin_url', 500)->nullable();
            $table->string('github_url', 500)->nullable();
            $table->string('resume_path', 500)->nullable();
            $table->unsignedTinyInteger('profile_completion')->default(0);
            $table->unsignedInteger('total_xp')->default(0);
            $table->unsignedTinyInteger('current_level')->default(1);
            $table->unsignedSmallInteger('streak_days')->default(0);
            $table->timestamp('last_active_at')->nullable();
            $table->char('country_code', 2)->default('BD');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('total_xp');
            $table->index('country_code');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
