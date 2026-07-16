<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("questions", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->smallInteger("type")->nullable();
$table->string("title" )->nullable();
$table->text("description")->nullable();
$table->smallInteger("body_type")->nullable();
$table->string("body_url" )->nullable();
$table->bigInteger("body_file_id")->nullable()->index();
$table->decimal("weight_true" , 8, 2)->nullable();
$table->decimal("weight_null" , 8, 2)->nullable();
$table->decimal("weight_false" , 8, 2)->nullable();
$table->decimal("weight_min" , 8, 2)->nullable();
$table->decimal("weight_max" , 8, 2)->nullable();
$table->smallInteger("index")->nullable();
$table->comment("questions");
$table->text("data" )->nullable();

});
}



public function down(): void {
Schema::dropIfExists('questions');
}

};
