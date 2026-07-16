<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
    Schema::create("batch_users", function (Blueprint $table) {
        $table->id("id");
        $table->uuid("uuid")->nullable()->index();
        $table->timestamps();
        $table->softDeletes();
        $table->bigInteger("created_by")->nullable()->unsigned()->index();
        $table->bigInteger("updated_by")->nullable()->unsigned()->index();
        $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
        $table->bigInteger("batch_id")->nullable()->index();
        $table->bigInteger("program_id")->nullable()->index();
        $table->bigInteger("user_id")->nullable()->index();
        $table->string("number" )->nullable();
        $table->timestamp("from")->nullable()->index();
        $table->timestamp("to")->nullable();
        $table->string("remarks" )->nullable();
        $table->bigInteger("file_id")->nullable()->index();
        $table->smallInteger("status")->nullable()->comment('admitted, verified, paid, ongoing, finished, expired/cancelled');
        $table->bigInteger("transaction_id")->nullable()->index();
        $table->tinyInteger("transaction_status")->nullable()->default(3)->comment('enum payment');
        $table->bigInteger("transaction2_id")->nullable()->index();
        $table->tinyInteger("transaction2_status")->nullable()->default(3)->index()->comment('enum payment');
        $table->tinyInteger("payment_type_administration")->nullable()->comment('const payment type');
        $table->tinyInteger("payment_type_training")->nullable()->comment('const payment type');
        $table->comment("batch_users table");
    });
}



public function down(): void {
Schema::dropIfExists('batch_users');
}

};