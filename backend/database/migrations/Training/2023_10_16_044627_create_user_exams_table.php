<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("user_exams", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->string("number")->nullable();
            $table->string("link")->nullable();
            $table->bigInteger("template_id")->nullable()->index();
            $table->bigInteger("user_id")->nullable()->index();
            $table->decimal("duration", 8, 2)->nullable();
            $table->timestamp("requested_at")->nullable();
            $table->timestamp("scheduled_at")->nullable();
            $table->timestamp("expired_at")->nullable();
            $table->timestamp("started_at")->nullable();
            $table->timestamp("finished_at")->nullable();
            $table->timestamp("working_date")->nullable();
            $table->decimal("weight_total", 8, 2)->nullable();
            $table->decimal("weight_achieved", 8, 2)->nullable();
            $table->smallInteger("status")->nullable();
            $table->bigInteger("user_exam_schedule_id")->nullable()->unsigned()->index();
            $table->integer("jadwal_tersedia")->default(0)->nullable();
            $table->integer("file_tes_character_status")->default(0)->nullable();
            $table->comment("user exams");
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('user_exams');
    }
};
