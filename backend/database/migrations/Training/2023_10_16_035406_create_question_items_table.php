<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("question_items", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->bigInteger("question_id")->nullable()->index();
$table->text("description")->nullable();
$table->boolean("is_correct")->nullable()->default(true);
$table->smallInteger("body_type")->nullable();
$table->string("body_url" )->nullable();
$table->bigInteger("body_file_id")->nullable()->index();
$table->smallInteger("index")->nullable();
$table->decimal("weight" , 8, 2)->nullable();
$table->comment("question items");});
}



public function down(): void {
Schema::dropIfExists('question_items');
}

};