<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_badges', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('badge_id');
            $table->enum('role', ['student', 'trainer']);
            $table->unsignedBigInteger('student_id')->nullable();
            $table->unsignedBigInteger('trainer_id')->nullable();
            $table->timestamp('unlocked_at');
            $table->integer('xp_awarded');
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('badge_id')->references('id')->on('badges');
            $table->unique(['user_id', 'badge_id']);
            $table->index(['user_id', 'role']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_badges');
    }
};
