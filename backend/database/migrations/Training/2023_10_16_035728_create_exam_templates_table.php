<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("exam_templates", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("title")->nullable();
            $table->text("description")->nullable();
            $table->decimal("duration", 8, 2)->nullable();
            $table->boolean("is_randomized_question")->nullable()->default(false);
            $table->boolean("is_randomized_items")->nullable()->default(false);
            $table->smallInteger("retry_count")->nullable();
            $table->decimal("weight_total", 8, 2)->nullable();
            $table->decimal("weight_minimal", 8, 2)->nullable();
            $table->boolean("is_active")->nullable()->default(false);
            $table->comment("exam templates");
            $table->tinyInteger("type")->nullable()->comment("jika 1 maka dia pratest, constant user exam type");
            $table->tinyInteger("exam_template_type")->nullable()->comment("jika 1 maka dia pratest, constant exam template");
            $table->string("link_url")->nullable();
            $table->bigInteger("video_id")->nullable();
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('exam_templates');
    }
};
