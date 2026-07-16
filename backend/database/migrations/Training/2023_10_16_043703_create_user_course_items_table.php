<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("user_course_items", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->bigInteger("course_id")->nullable()->index();
            $table->bigInteger("item_id")->nullable()->index();
            $table->decimal("progress", 8, 2)->nullable();
            $table->decimal("weight_total", 8, 2)->nullable();
            $table->decimal("weight_minimum", 8, 2)->nullable();
            $table->decimal("weight_maximum", 8, 2)->nullable();
            $table->decimal("weight_final", 8, 2)->nullable();
            $table->string("link")->nullable();
            $table->timestamp("working_date")->nullable();
            $table->bigInteger("user_exam_id")->nullable()->index();
            $table->bigInteger("event_id")->nullable()->index();
            $table->boolean("is_skipped")->nullable()->default(false);
            $table->tinyInteger("status")->nullable()->default(false);
            $table->tinyInteger("is_scheduled")->nullable()->default(0);
            $table->bigInteger("exam_template_item_id")->nullable()->index();
            $table->comment("user course items");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('user_course_items');
    }
};
