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
        Schema::create('seminars', function (Blueprint $table) {
            $table->id();
            $table->uuid("uuid")->nullable()->index();
            $table->string("name")->nullable();
            $table->tinyInteger("status")->nullable()->default(0);
            $table->timestamp("started_at")->nullable();
            $table->timestamp("finished_at")->nullable();
            $table->string("link")->nullable();
            $table->bigInteger("cover_id")->nullable()->unsigned();
            $table->text("description")->nullable();
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
        Schema::dropIfExists('seminars');
    }
};
