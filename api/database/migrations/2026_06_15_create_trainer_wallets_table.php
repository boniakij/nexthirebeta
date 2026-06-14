<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('trainer_wallets', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('trainer_id')->unique();
            $table->char('currency', 3)->default('BDT');
            $table->decimal('total_earned', 12, 2)->default(0.00);
            $table->decimal('available_balance', 12, 2)->default(0.00);
            $table->decimal('pending_balance', 12, 2)->default(0.00);
            $table->decimal('withdrawn_amount', 12, 2)->default(0.00);
            $table->decimal('platform_commission_total', 12, 2)->default(0.00);
            $table->timestamps();

            $table->foreign('trainer_id')->references('id')->on('trainers')->cascadeOnDelete();
            $table->index('trainer_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('trainer_wallets');
    }
};
