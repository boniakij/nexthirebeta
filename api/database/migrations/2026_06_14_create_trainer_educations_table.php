<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_educations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trainer_id')->constrained('trainers')->onDelete('cascade');
            $table->string('degree', 150);
            $table->string('institution_name', 200);
            $table->string('field_of_study', 150)->nullable();
            $table->integer('start_year')->nullable();
            $table->integer('graduation_year');
            $table->string('grade', 10)->nullable();
            $table->text('description')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index('trainer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_educations');
    }
};
