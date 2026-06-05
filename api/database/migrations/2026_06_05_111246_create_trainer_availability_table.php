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
        Schema::create('trainer_availability', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('trainer_id');
            $table->date('date');
            $table->time('start_time');
            $table->time('end_time');
            $table->boolean('is_booked')->default(false);
            $table->timestamps();
            $table->foreign('trainer_id')->references('id')->on('trainers')->onDelete('cascade');
            $table->unique(['trainer_id', 'date', 'start_time']);
            $table->index(['trainer_id', 'date', 'is_booked']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trainer_availability');
    }
};
