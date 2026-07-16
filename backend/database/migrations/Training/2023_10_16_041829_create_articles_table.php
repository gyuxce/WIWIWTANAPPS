<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("articles", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("title")->nullable();
            $table->text("description")->nullable();
            $table->smallInteger("body_type")->nullable();
            $table->string("body_url")->nullable();
            $table->decimal("duration", 8, 2)->nullable();
            $table->text("body_text")->nullable();
            $table->bigInteger("body_file_id")->nullable()->index();
            $table->bigInteger("cover_file_id")->nullable()->index();
            $table->bigInteger("course_item_id")->nullable()->index();
            $table->bigInteger("course_id")->nullable()->index();
            $table->comment("articles");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};
