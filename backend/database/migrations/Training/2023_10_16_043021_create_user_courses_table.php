<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
return new class extends Migration {

public function up(): void {
Schema::create("user_courses", function (Blueprint $table) {$table->id("id");
$table->uuid("uuid")->nullable()->index();
$table->timestamps();
$table->softDeletes();
$table->bigInteger("created_by")->nullable()->unsigned()->index();
$table->bigInteger("updated_by")->nullable()->unsigned()->index();
$table->bigInteger("deleted_by")->nullable()->unsigned()->index();
$table->bigInteger("user_id")->nullable()->index();
$table->bigInteger("course_id")->nullable()->index();
$table->timestamp("acquired_at")->nullable();
$table->timestamp("started_at")->nullable();
$table->timestamp("finished_at")->nullable();
$table->timestamp("last_activity_at")->nullable();
$table->smallInteger("item_finished")->nullable();
$table->decimal("exam_score_total" , 8, 2)->nullable();
$table->decimal("exam_score_achieved" , 8, 2)->nullable();
$table->decimal("exam_score_normalized" , 8, 2)->nullable();
$table->smallInteger("status")->nullable();
$table->comment("user courses");});
}



public function down(): void {
Schema::dropIfExists('user_courses');
}

};