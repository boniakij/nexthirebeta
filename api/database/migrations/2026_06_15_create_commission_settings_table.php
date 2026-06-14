<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commission_settings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('rule_name', 100);
            $table->enum('commission_type', ['percentage', 'fixed'])->default('percentage');
            $table->decimal('commission_value', 10, 2);
            $table->decimal('fixed_amount', 12, 2)->nullable();
            $table->enum('applies_to', ['global', 'trainer', 'package', 'category'])->default('global');
            $table->unsignedBigInteger('trainer_id')->nullable();
            $table->unsignedBigInteger('package_id')->nullable();
            $table->string('package_category', 100)->nullable();
            $table->char('currency', 3)->default('BDT');
            $table->integer('priority')->default(100);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->unsignedBigInteger('created_by')->nullable();
            $table->unsignedBigInteger('updated_by')->nullable();
            $table->timestamps();

            $table->foreign('trainer_id')->references('id')->on('trainers')->nullOnDelete();
            $table->foreign('package_id')->references('id')->on('interview_packages')->nullOnDelete();
            $table->index('status');
            $table->index('applies_to');
            $table->index('priority');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commission_settings');
    }
};
