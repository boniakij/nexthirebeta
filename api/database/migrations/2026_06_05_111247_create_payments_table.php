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
        Schema::create('payments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('payer_id');
            $table->unsignedBigInteger('payee_id')->nullable();
            $table->unsignedBigInteger('interview_id')->nullable();
            $table->decimal('amount', 12, 2);
            $table->decimal('commission', 12, 2)->default(0.00);
            $table->char('currency', 3)->default('BDT');
            $table->enum('gateway', ['sslcommerz', 'bkash', 'nagad', 'stripe', 'paypal']);
            $table->string('gateway_txn_id', 200)->unique()->nullable();
            $table->enum('status', ['pending', 'completed', 'failed', 'refunded', 'payout_pending', 'paid'])->default('pending');
            $table->string('invoice_path', 500)->nullable();
            $table->timestamp('payout_processed_at')->nullable();
            $table->timestamps();
            $table->foreign('payer_id')->references('id')->on('users');
            $table->foreign('payee_id')->references('id')->on('users');
            $table->foreign('interview_id')->references('id')->on('interviews');
            $table->index('status');
            $table->index('gateway_txn_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
