<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('xp_rules', function (Blueprint $table) {
            $table->id();
            $table->string('rule_name');
            $table->enum('applies_to', ['student', 'trainer']);
            $table->string('event_type')->unique();
            $table->integer('xp_amount');
            $table->string('frequency_limit')->default('once_per_event');
            $table->integer('max_award_per_day')->nullable();
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('xp_rules');
    }
};
