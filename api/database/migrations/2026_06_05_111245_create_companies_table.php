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
        Schema::create('companies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('company_name', 300);
            $table->string('company_website', 500)->nullable();
            $table->string('industry', 200)->nullable();
            $table->enum('company_size', ['1-10', '11-50', '51-200', '201-500', '500+'])->nullable();
            $table->string('registration_number', 200)->nullable();
            $table->string('kyc_document_path', 500)->nullable();
            $table->enum('kyc_status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();
            $table->string('hr_contact_name', 200)->nullable();
            $table->string('hr_contact_email')->nullable();
            $table->string('logo_path', 500)->nullable();
            $table->char('country_code', 2)->default('BD');
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->index('kyc_status');
            $table->index('is_verified');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
