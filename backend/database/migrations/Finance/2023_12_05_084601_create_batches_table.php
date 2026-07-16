<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("batches", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->string("title" )->nullable();
$table->string("period" )->nullable();
$table->timestamp("from")->nullable();
$table->timestamp("to")->nullable();
$table->bigInteger("program_id")->nullable()->index();
$table->string("remarks" )->nullable();
$table->integer("capacity")->nullable();
$table->comment("batch table");});
}



public function down(): void {
Schema::dropIfExists('batches');
}

};