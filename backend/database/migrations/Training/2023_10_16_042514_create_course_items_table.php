<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("course_items", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->smallInteger("group")->nullable();
            $table->bigInteger("course_id")->nullable()->index();

            $table->integer("parent_id")->nullable()->index();
            $table->boolean("is_header")->nullable();
            $table->string("title")->nullable();
            $table->text("description")->nullable();
            $table->bigInteger("article_id")->nullable()->index();
            $table->bigInteger("exam_template_id")->nullable()->index();
            $table->bigInteger("event_id")->nullable()->index();
            $table->smallInteger("index")->nullable();
            $table->smallInteger("type")->nullable();
            $table->smallInteger("program_type")->nullable();
            $table->smallInteger("level_module")->nullable();
            $table->smallInteger("access_module")->nullable();
            $table->bigInteger("file_id")->nullable()->index();
            $table->smallInteger("is_active")->nullable()->index();
            $table->decimal("weight_minimum", 8, 2)->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->comment("course items");
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('course_items');
    }
};
