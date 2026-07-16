<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create("files", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("name")->nullable();
            $table->string("filename")->nullable();
            $table->string("url")->nullable();
            $table->string("local_url")->nullable();
            $table->string("adapter")->nullable();
            $table->integer("height")->nullable();
            $table->integer("width")->nullable();
            $table->integer("size")->nullable();
            $table->comment("file");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('files');
    }

};