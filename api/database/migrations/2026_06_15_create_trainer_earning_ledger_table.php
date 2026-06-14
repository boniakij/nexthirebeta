<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_earning_ledger', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('trainer_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('booking_id');
            $table->unsignedBigInteger('interview_id');
            $table->unsignedBigInteger('payment_id');
            $table->decimal('gross_amount', 12, 2);
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('net_amount', 12, 2);
            $table->char('currency', 3)->default('BDT');
            $table->enum('status', ['pending', 'available', 'withdraw_requested', 'paid', 'cancelled', 'refunded'])->default('pending');
            $table->timestamp('available_at')->nullable();
            $table->timestamps();

            $table->foreign('trainer_id')->references('id')->on('trainers');
            $table->foreign('student_id')->references('id')->on('users');
            $table->foreign('booking_id')->references('id')->on('interview_bookings');
            $table->foreign('interview_id')->references('id')->on('interviews');
            $table->foreign('payment_id')->references('id')->on('payments');
            $table->unique(['interview_id', 'trainer_id']);
            $table->index('status');
            $table->index('trainer_id');
            $table->index('available_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_earning_ledger');
    }
};
