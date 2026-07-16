<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create("forum_posts", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("title")->nullable();
            $table->text("description")->nullable();
            $table->bigInteger("index")->nullable()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->bigInteger("topic_id")->nullable()->index();
            $table->boolean("is_draft")->nullable()->default(true);
            $table->boolean("is_publish")->nullable()->default(false);
            $table->tinyInteger("status")->nullable();
            $table->tinyInteger("status_report")->nullable()->default(1);
            $table->integer("count_like")->nullable();
            $table->integer("count_comment")->nullable();
            $table->integer("count_report")->nullable();
            $table->string("deleted_reason")->nullable();
            $table->comment("form posts");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
    }

};