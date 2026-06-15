<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_gamification_stats', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->enum('role', ['student', 'trainer']);
            $table->integer('total_xp')->default(0);
            $table->integer('current_level')->default(1);
            $table->integer('badges_count')->default(0);
            $table->integer('country_rank')->nullable();
            $table->integer('global_rank')->nullable();
            $table->integer('streak_days')->default(0);
            $table->date('last_login_date')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_gamification_stats');
    }
};
