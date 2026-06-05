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
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->char('uuid', 36)->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('phone', 20)->nullable();
            $table->enum('role', ['student', 'trainer', 'company', 'admin']);
            $table->enum('status', ['active', 'suspended', 'pending'])->default('pending');
            $table->timestamp('email_verified_at')->nullable();
            $table->string('google_id', 100)->nullable();
            $table->string('profile_photo', 500)->nullable();
            $table->timestamps();
            $table->index('role');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
