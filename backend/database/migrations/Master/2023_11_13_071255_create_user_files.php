<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {

    public function up(): void
    {
        Schema::create("user_files", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->tinyInteger("type")->nullable()->comment('type');
            $table->string("description")->nullable();
            $table->string("slug")->nullable()->index();
            $table->boolean('status')->default(true);
            $table->integer("file_id")->nullable();
            $table->integer("user_id")->nullable();
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('files');
    }

};
