<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('badges', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('name');
            $table->text('description');
            $table->enum('category', ['interview', 'skill', 'milestone', 'streak', 'profile', 'trainer', 'leaderboard', 'special']);
            $table->enum('applies_to', ['student', 'trainer']);
            $table->string('icon_path')->nullable();
            $table->integer('xp_reward');
            $table->json('unlock_condition_json');
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
