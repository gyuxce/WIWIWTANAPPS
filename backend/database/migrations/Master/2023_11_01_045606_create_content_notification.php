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
        Schema::create('content_notifications', function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->string("name")->nullable();
            $table->text("description")->nullable();
            $table->dateTime("send_at")->nullable();
            $table->tinyInteger("repeat_each")->nullable();
            $table->tinyInteger("status")->nullable();
            $table->tinyInteger("is_active")->nullable();
            $table->integer("count_send")->default(0)->nullable();
            $table->string("link")->nullable();
            $table->tinyInteger("target_status")->nullable();
            $table->timestamps();
            $table->softDeletes();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
            $table->bigInteger("deleted_by")->nullable()->unsigned()->index();
        });

        Schema::create('content_notification_target', function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->bigInteger("cn_id")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->unsigned()->index();
            $table->timestamps();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
        });

        Schema::create('content_notification_logs', function (Blueprint $table) {
            $table->id("id");
            $table->uuid("uuid")->nullable()->index();
            $table->bigInteger("cn_id")->nullable()->unsigned()->index();
            $table->bigInteger("user_id")->nullable()->unsigned()->index();
            $table->timestamps();
            $table->bigInteger("created_by")->nullable()->unsigned()->index();
            $table->bigInteger("updated_by")->nullable()->unsigned()->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('content_notifications');
        Schema::dropIfExists('content_notification_target');
        Schema::dropIfExists('content_notification_logs');
    }
};
