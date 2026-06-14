<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->string('skill_name', 150);
            $table->string('skill_category', 100)->nullable();
            $table->enum('skill_level', ['Beginner', 'Intermediate', 'Advanced', 'Expert'])->default('Intermediate');
            $table->integer('years_experience')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('trainer_id');
            $table->index('is_featured');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_skills');
    }
};
