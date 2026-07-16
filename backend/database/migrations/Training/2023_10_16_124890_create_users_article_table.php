<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("user_article", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->bigInteger("article_id")->nullable()->index();
            $table->smallInteger("status")->nullable();
            $table->decimal("duration", 8, 2)->nullable();
            $table->comment("user_article");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
