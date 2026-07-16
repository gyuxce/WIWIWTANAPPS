<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create("forum_comments", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->text("comment")->nullable();
            $table->integer("index")->nullable()->index();
            $table->bigInteger("parent_id")->nullable()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->bigInteger("post_id")->nullable()->index();
            $table->bigInteger("replied_to")->nullable()->index();
            $table->boolean("is_publish")->nullable()->default(false);
            $table->boolean("is_update")->nullable()->default(false);
            $table->integer("count_like")->nullable();
            $table->integer("count_report")->nullable();
            $table->tinyInteger("status_report")->nullable()->default(1);
            $table->comment("forum comments");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('forum_comments');
    }

};