<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("exam_schedules", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->bigInteger("user_exam_id")->nullable()->index();
            $table->timestamp("start_date")->nullable();
            $table->timestamp("end_date")->nullable();
            $table->comment("exam_schedules");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('exam_schedules');
    }
};
