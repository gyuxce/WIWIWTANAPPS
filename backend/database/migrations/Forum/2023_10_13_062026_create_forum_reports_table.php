<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create("forum_reports", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->bigInteger("post_id")->nullable()->index();
            $table->bigInteger("comment_id")->nullable()->index();
            $table->string("notes")->nullable();
            $table->integer("status")->nullable();
            $table->integer("type")->nullable();
            $table->comment("forum report");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('forum_reports');
    }

};