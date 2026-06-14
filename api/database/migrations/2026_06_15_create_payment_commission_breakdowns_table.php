<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payment_commission_breakdowns', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('payment_id');
            $table->unsignedBigInteger('trainer_id');
            $table->unsignedBigInteger('package_id')->nullable();
            $table->unsignedBigInteger('commission_setting_id');
            $table->decimal('gross_amount', 12, 2);
            $table->enum('commission_type', ['percentage', 'fixed']);
            $table->decimal('commission_value', 10, 2);
            $table->decimal('commission_amount', 12, 2);
            $table->decimal('trainer_net_amount', 12, 2);
            $table->char('currency', 3)->default('BDT');
            $table->timestamp('calculated_at')->useCurrent();
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('payments');
            $table->foreign('trainer_id')->references('id')->on('trainers');
            $table->foreign('package_id')->references('id')->on('interview_packages')->nullOnDelete();
            $table->foreign('commission_setting_id')->references('id')->on('commission_settings');
            $table->unique(['payment_id', 'trainer_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_commission_breakdowns');
    }
};
