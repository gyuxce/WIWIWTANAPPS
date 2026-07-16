<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("bank_accounts", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->string("name" )->nullable();
$table->bigInteger("bank_id")->nullable()->index();
$table->string("account_name" )->nullable();
$table->string("account_number" )->nullable();
$table->boolean("is_active")->nullable();
$table->comment("bank_accounts table");});
}



public function down(): void {
Schema::dropIfExists('bank_accounts');
}

};