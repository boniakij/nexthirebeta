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
        Schema::create('badges', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('slug', 100)->unique();
            $table->string('name', 200);
            $table->text('description')->nullable();
            $table->string('icon_path', 500)->nullable();
            $table->unsignedInteger('xp_reward')->default(25);
            $table->json('unlock_condition');
            $table->enum('category', ['achievement', 'skill', 'milestone', 'special']);
            $table->timestamp('created_at')->useCurrent();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('badges');
    }
};
