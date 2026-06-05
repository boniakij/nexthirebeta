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
        Schema::create('campaign_candidates', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('campaign_id');
            $table->unsignedBigInteger('student_id');
            $table->enum('stage', ['invited', 'interviewed', 'shortlisted', 'hired', 'rejected'])->default('invited');
            $table->text('notes')->nullable();
            $table->timestamp('invited_at')->useCurrent();
            $table->timestamp('updated_at')->useCurrent();
            $table->foreign('campaign_id')->references('id')->on('hiring_campaigns');
            $table->foreign('student_id')->references('id')->on('students');
            $table->unique(['campaign_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaign_candidates');
    }
};
