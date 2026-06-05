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
        Schema::create('points_ledger', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('student_id');
            $table->integer('xp_amount');
            $table->string('event_type', 100);
            $table->unsignedBigInteger('reference_id')->nullable();
            $table->string('description', 300)->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->index('student_id');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('points_ledger');
    }
};
