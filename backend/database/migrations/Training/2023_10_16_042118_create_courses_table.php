<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void {
        Schema::create("courses", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->string("title")->nullable();
            $table->string("title_japan")->nullable();
            $table->text("description")->nullable();
            $table->integer("count_articles")->nullable();
            $table->integer("count_events")->nullable();
            $table->integer("count_exam")->nullable();
            $table->tinyInteger("type")->nullable();
            $table->bigInteger("cover_id")->nullable()->unsigned();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->comment("courses");
        });
    }

    public function down(): void {
        Schema::dropIfExists('courses');
    }

};