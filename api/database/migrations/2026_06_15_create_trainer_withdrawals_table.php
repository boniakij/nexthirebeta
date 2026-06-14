<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_withdrawals', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('trainer_id');
            $table->unsignedBigInteger('payout_method_id')->nullable();
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3)->default('BDT');
            $table->enum('status', ['pending', 'approved', 'rejected', 'processing', 'paid'])->default('pending');
            $table->timestamp('requested_at')->useCurrent();
            $table->timestamp('approved_at')->nullable();
            $table->timestamp('processed_at')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->timestamp('rejected_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->string('transaction_reference', 100)->nullable();
            $table->text('trainer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamps();

            $table->foreign('trainer_id')->references('id')->on('trainers');
            $table->index('status');
            $table->index('trainer_id');
            $table->index('requested_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_withdrawals');
    }
};
