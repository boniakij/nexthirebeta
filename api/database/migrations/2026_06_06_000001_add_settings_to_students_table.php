<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->json('notification_settings')->nullable()->after('total_xp');
            $table->json('privacy_settings')->nullable()->after('notification_settings');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn('notification_settings');
            $table->dropColumn('privacy_settings');
        });
    }
};
