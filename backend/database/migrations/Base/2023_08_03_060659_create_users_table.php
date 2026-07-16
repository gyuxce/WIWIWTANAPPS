<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create("users", function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->string("name", 255)->nullable();
            $table->string("name_alias", 255)->nullable();
            $table->string("email", 255)->nullable();
            $table->timestamp("email_verified_at")->nullable();
            $table->timestamp("password_updated_at")->nullable();
            $table->string("google_id")->nullable();
            $table->string("facebook_id")->nullable();
            $table->string("apple_id")->nullable();
            $table->string("password", 255)->nullable();
            $table->string("username", 255)->nullable();
            $table->tinyInteger("count_login_attempt")->nullable();
            $table->boolean("is_active")->default(false)->nullable();
            $table->date("active_date")->nullable();
            $table->string("remember_token", 255)->nullable();
            $table->string("phone")->nullable();
            $table->string("address")->nullable();
            $table->bigInteger("city_id")->nullable()->unsigned()->index();
            $table->bigInteger("province_id")->nullable()->unsigned()->index();
            $table->bigInteger("role_id")->nullable()->unsigned()->index();
            $table->bigInteger("location_id")->nullable()->unsigned()->index();
            $table->string("birthplace")->nullable();
            $table->string("education_departement")->nullable();
            $table->string("join_reason")->nullable();
            $table->date("join_date")->nullable();
            $table->date("dob")->nullable();
            $table->integer("blood_type")->nullable();
            $table->integer("last_education")->nullable();

            $table->string("study_program")->nullable();
            $table->string("id_card")->nullable();

            $table->string("ethnic_origin")->nullable();
            $table->boolean("is_training")->default(false)->nullable();
            $table->integer("training_program")->nullable();
            $table->integer("training_preference")->nullable()->default(1);
            $table->integer("register_information")->nullable();
            $table->string("other_register_information")->nullable();

            $table->bigInteger("certificate_id")->nullable()->unsigned()->index();
            $table->bigInteger("cv_id")->nullable()->unsigned()->index();
            $table->bigInteger("profile_pic_id")->nullable()->unsigned()->index();
            $table->smallInteger("interview_status")->nullable();
            $table->smallInteger("interview_count")->nullable();
            $table->bigInteger("current_sesi_language_id")->nullable()->unsigned()->index();
            $table->tinyInteger("last_phase")->nullable();
            $table->tinyInteger("last_level")->nullable()->default(5);
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
            $table->timestamps();
            $table->softDeletes();
        });
    }



    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
