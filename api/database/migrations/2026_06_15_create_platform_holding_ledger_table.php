<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('platform_holding_ledger', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('payment_id')->unique();
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('interview_id');
            $table->unsignedBigInteger('trainer_id');
            $table->unsignedBigInteger('student_id');
            $table->decimal('gross_amount', 12, 2);
            $table->char('currency', 3)->default('BDT');
            $table->enum('status', ['platform_held', 'released_to_trainer', 'refunded', 'cancelled'])->default('platform_held');
            $table->timestamp('held_at')->useCurrent();
            $table->timestamp('released_at')->nullable();
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('payments');
            $table->foreign('booking_id')->references('id')->on('interview_bookings');
            $table->foreign('interview_id')->references('id')->on('interviews');
            $table->foreign('trainer_id')->references('id')->on('trainers');
            $table->foreign('student_id')->references('id')->on('users');
            $table->index('status');
            $table->index('trainer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_holding_ledger');
    }
};
