<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("user_exam_questions", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_exam_id")->nullable()->index();
            $table->bigInteger("question_id")->nullable()->index();
            $table->integer("index")->nullable()->index();
            $table->string("o_title")->nullable();
            $table->text("o_description")->nullable();
            $table->string("o_body_type")->nullable();
            $table->string("o_body_url")->nullable();
            $table->bigInteger("o_body_file_id")->nullable()->index();
            $table->smallInteger("a_body_type")->nullable();
            $table->text("a_body_text")->nullable();
            $table->string("a_body_url")->nullable();
            $table->bigInteger("a_body_file_id")->nullable()->index();
            $table->bigInteger("a_weight")->nullable()->index();
            $table->decimal("o_weight_true", 8, 2)->nullable();
            $table->decimal("o_weight_null", 8, 2)->nullable();
            $table->decimal("o_weight_false", 8, 2)->nullable();
            $table->decimal("o_weight_min", 8, 2)->nullable();
            $table->decimal("o_weight_max", 8, 2)->nullable();
            $table->timestamp("assessed_at")->nullable();
            $table->bigInteger("assessed_by")->nullable()->index();
            $table->boolean("is_header")->nullable()->default(false);
            $table->comment("user exam questions");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('user_exam_questions');
    }
};
