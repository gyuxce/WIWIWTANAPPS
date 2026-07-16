<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("activity_logs", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->bigInteger("user_id")->nullable()->unsigned()->index();
            $table->string("module_uuid")->nullable();
            $table->string("module")->nullable();
            $table->string("action")->nullable();
            $table->string("description", 500)->nullable();
            $table->json("data")->nullable();
            $table->timestamps();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();

            $table->comment('data untuk jejak pengguna sistem');
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
    }
};
