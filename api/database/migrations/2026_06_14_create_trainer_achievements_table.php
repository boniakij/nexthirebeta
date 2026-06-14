<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->string('title', 250);
            $table->enum('type', ['Project', 'Achievement', 'Award', 'Publication', 'Training Program'])->default('Project');
            $table->string('organization', 200)->nullable();
            $table->string('role', 150)->nullable();
            $table->date('achievement_date')->nullable();
            $table->text('description');
            $table->text('result_impact')->nullable();
            $table->string('project_url', 500)->nullable();
            $table->string('attachment_file', 300)->nullable();
            $table->boolean('is_public')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('trainer_id');
            $table->index('is_public');
            $table->index('type');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_achievements');
    }
};
