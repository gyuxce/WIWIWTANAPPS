<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("user_exam_question_items", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_exam_id")->nullable()->index();
            $table->bigInteger("question_id")->nullable()->index();
            $table->bigInteger("question_item_id")->nullable()->index();
            $table->boolean("is_selected")->nullable()->default(false);
            $table->smallInteger("index")->nullable()->index();
            $table->string("o_description")->nullable();
            $table->smallInteger("o_body_type")->nullable();
            $table->string("o_body_url")->nullable();
            $table->bigInteger("o_body_file_id")->nullable()->index();
            $table->boolean("o_is_correct")->nullable()->default(false);
            $table->decimal("o_weight", 8, 2)->nullable();
            $table->comment("user exam question items");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('user_exam_question_items');
    }
};
