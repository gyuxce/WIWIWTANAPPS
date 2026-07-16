<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void {
        Schema::create("forum_topics", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("name" )->nullable();
            $table->text("description")->nullable();
            $table->tinyInteger("type")->nullable()->default('1');
            $table->bigInteger("index")->nullable()->index();
            $table->bigInteger("file_id")->nullable()->unsigned()->index();
            $table->integer("count_post")->nullable();
            $table->comment("forum topic");
        });
    }

    public function down(): void {
        Schema::dropIfExists('forum_topics');
    }

};