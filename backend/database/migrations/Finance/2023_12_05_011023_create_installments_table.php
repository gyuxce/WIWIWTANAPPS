<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("installments", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->bigInteger("transaction_id")->nullable()->index();
$table->smallInteger("period_type")->nullable()->comment('monthly, quarterly, yearly');
$table->smallInteger("period_length")->nullable();
$table->bigInteger("payment_first_id")->nullable()->index();
$table->timestamp("payment_first_at")->nullable();
$table->bigInteger("payment_next_id")->nullable()->index();
$table->timestamp("payment_next_at")->nullable();
$table->bigInteger("payment_last_id")->nullable()->index();
$table->timestamp("payment_last_at")->nullable();
$table->boolean("is_paid")->nullable();
$table->tinyInteger("index")->nullable();
$table->bigInteger("file_id")->nullable()->index();
$table->bigInteger("file2_id")->nullable()->index();
$table->bigInteger("file3_id")->nullable()->index();
$table->comment("installments table");});
}



public function down(): void {
Schema::dropIfExists('installments');
}

};