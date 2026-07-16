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
        Schema::table('batch_users', function (Blueprint $table) {
            $table->timestamp('transaction_last_at')->nullable();
            $table->timestamp('transaction_due_at')->nullable();
            $table->timestamp('transaction2_last_at')->nullable();
            $table->timestamp('transaction2_due_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('batch_users', function (Blueprint $table) {
            $table->dropColumn('transaction_last_at');
            $table->dropColumn('transaction_due_at');
            $table->dropColumn('transaction2_last_at');
            $table->dropColumn('transaction2_due_at');
        });
    }
};
