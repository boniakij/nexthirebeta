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
        Schema::table('interview_packages', function (Blueprint $table) {
            $table->string('target_level')->nullable();
            $table->json('tags')->nullable();
            $table->string('session_mode')->nullable();
            $table->boolean('includes_written_feedback')->default(false);
            $table->text('preparation_instructions')->nullable();
            $table->string('currency')->default('BDT');
            $table->json('required_documents')->nullable();
            $table->json('custom_questions')->nullable();
            $table->string('availability_scope')->default('all_slots');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interview_packages', function (Blueprint $table) {
            $table->dropColumn([
                'target_level',
                'tags',
                'session_mode',
                'includes_written_feedback',
                'preparation_instructions',
                'currency',
                'required_documents',
                'custom_questions',
                'availability_scope',
            ]);
        });
    }
};
