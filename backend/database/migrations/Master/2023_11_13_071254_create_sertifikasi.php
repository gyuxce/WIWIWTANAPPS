<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('certifications', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->nullable()->index();

            $table->string("name")->nullable();
            $table->string("detail", 2055)->nullable();
            $table->string("description", 2055)->nullable();
            $table->string("link", 2055)->nullable();
            $table->tinyInteger("status")->nullable()->default(0);

            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('certification_students', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->nullable()->index();

            $table->string("name")->nullable();
            $table->bigInteger("user_id")->nullable()->unsigned()->index();
            $table->bigInteger("certification_id")->nullable()->unsigned()->index();
            $table->dateTime("cert_date")->nullable();
            $table->string("location", 2055)->nullable();
            $table->bigInteger("cert_file_id")->nullable()->unsigned()->index();
            $table->tinyInteger("status")->nullable()->default(0);

            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('certifications');
        Schema::dropIfExists('certification_students');
    }
};
