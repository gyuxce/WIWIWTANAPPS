<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("interviews", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->smallInteger("type")->nullable();
            $table->timestamp("interview_date")->nullable();
            $table->string("name")->nullable();
            $table->string("position")->nullable();
            $table->string("agency")->nullable();
            $table->string("link")->nullable();
            $table->comment("interviews");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('interviews');
    }
};
