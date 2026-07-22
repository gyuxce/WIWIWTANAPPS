<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('course_items', function (Blueprint $table) {
            $table->string('title_japan')->nullable()->after('title');
        });
    }

    public function down(): void
    {
        Schema::table('course_items', function (Blueprint $table) {
            $table->dropColumn('title_japan');
        });
    }
};
