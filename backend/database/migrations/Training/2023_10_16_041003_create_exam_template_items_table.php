<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("exam_template_items", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("template_id")->nullable()->index();
            $table->bigInteger("question_id")->nullable();
            $table->bigInteger("course_item_id")->nullable();
            $table->integer("index")->nullable();
            $table->boolean("is_header")->nullable()->default(false);
            $table->bigInteger("parent_id")->nullable();
            $table->string("title")->nullable();
            $table->text("description")->nullable();
            $table->smallInteger("body_type")->nullable();
            $table->string("body_url")->nullable();
            $table->bigInteger("body_file_id")->nullable()->index();
            $table->boolean("is_introduction")->nullable();
            $table->integer("language_type")->nullable();
            $table->decimal("duration", 8, 2)->nullable();
            $table->integer("count_question")->nullable();
            $table->decimal("weight_minimum", 8, 2)->nullable();
            $table->comment("exam template items");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('exam_template_items');
    }
};
