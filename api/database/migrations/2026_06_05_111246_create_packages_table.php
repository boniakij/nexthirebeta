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
        Schema::create('packages', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('trainer_id');
            $table->string('title', 300);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->unsignedTinyInteger('session_count')->default(1);
            $table->unsignedSmallInteger('duration_minutes')->default(60);
            $table->string('interview_type', 100);
            $table->string('domain', 100);
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced']);
            $table->string('language', 50)->default('English');
            $table->boolean('is_live')->default(true);
            $table->boolean('includes_cv_review')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('total_bookings')->default(0);
            $table->timestamps();
            $table->foreign('trainer_id')->references('id')->on('trainers')->onDelete('cascade');
            $table->index('domain');
            $table->index('is_active');
            $table->index('trainer_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('packages');
    }
};
