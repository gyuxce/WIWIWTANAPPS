<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("documents", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->bigInteger("user_id")->nullable()->index();
$table->smallInteger("type")->nullable();
$table->string("remarks" )->nullable();
$table->bigInteger("file_id")->nullable()->index();
$table->boolean("is_verified")->nullable()->default(false);
$table->bigInteger("verified_by")->nullable()->index();
$table->timestamp("verified_at")->nullable();
$table->comment("documents");});
}



public function down(): void {
Schema::dropIfExists('documents');
}

};